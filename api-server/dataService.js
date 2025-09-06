const fs = require('fs').promises;
const path = require('path');

class DataService {
  constructor(fileName) {
    this.filePath = path.join(__dirname, `${fileName}.json`);
  }

  async readData() {
    try {
      const data = await fs.readFile(this.filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      if (error.code === 'ENOENT') {
        // File doesn't exist, return empty array
        return [];
      }
      throw error;
    }
  }

  async writeData(data) {
    try {
      await fs.writeFile(this.filePath, JSON.stringify(data, null, 2));
    } catch (error) {
      throw error;
    }
  }

  async find(query = {}) {
    const data = await this.readData();
    return data.filter(item => this.matchesQuery(item, query));
  }

  async findOne(query = {}) {
    const data = await this.readData();
    return data.find(item => this.matchesQuery(item, query)) || null;
  }

  async findById(id) {
    const data = await this.readData();
    return data.find(item => item.id === id) || null;
  }

  async create(newItem) {
    const data = await this.readData();
    const item = {
      ...newItem,
      id: newItem.id || this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    data.push(item);
    await this.writeData(data);
    return item;
  }

  async updateOne(query, updateData) {
    const data = await this.readData();
    const index = data.findIndex(item => this.matchesQuery(item, query));
    if (index === -1) return null;

    data[index] = {
      ...data[index],
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    await this.writeData(data);
    return data[index];
  }

  async findByIdAndUpdate(id, updateData, options = {}) {
    const data = await this.readData();
    const index = data.findIndex(item => item.id === id);
    if (index === -1) return null;

    data[index] = {
      ...data[index],
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    await this.writeData(data);
    return data[index];
  }

  async findOneAndUpdate(query, updateData, options = {}) {
    return this.updateOne(query, updateData);
  }

  async findByIdAndDelete(id) {
    const data = await this.readData();
    const index = data.findIndex(item => item.id === id);
    if (index === -1) return null;

    const deletedItem = data.splice(index, 1)[0];
    await this.writeData(data);
    return deletedItem;
  }

  async findOneAndDelete(query) {
    const data = await this.readData();
    const index = data.findIndex(item => this.matchesQuery(item, query));
    if (index === -1) return null;

    const deletedItem = data.splice(index, 1)[0];
    await this.writeData(data);
    return deletedItem;
  }

  async deleteMany(query = {}) {
    const data = await this.readData();
    const filteredData = data.filter(item => !this.matchesQuery(item, query));
    const deletedCount = data.length - filteredData.length;
    await this.writeData(filteredData);
    return { deletedCount };
  }

  async countDocuments(query = {}) {
    const data = await this.readData();
    return data.filter(item => this.matchesQuery(item, query)).length;
  }

  async insertMany(items) {
    const data = await this.readData();
    const newItems = items.map(item => ({
      ...item,
      id: item.id || this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }));
    data.push(...newItems);
    await this.writeData(data);
    return newItems;
  }

  matchesQuery(item, query) {
    for (const [key, value] of Object.entries(query)) {
      if (key === '$or') {
        const orMatch = value.some(orQuery => this.matchesQuery(item, orQuery));
        if (!orMatch) return false;
      } else if (key === '$and') {
        const andMatch = value.every(andQuery => this.matchesQuery(item, andQuery));
        if (!andMatch) return false;
      } else if (typeof value === 'object' && value !== null) {
        if (value.$regex) {
          const regex = new RegExp(value.$regex, value.$options || '');
          if (!regex.test(item[key])) return false;
        } else if (value.$exists !== undefined) {
          const exists = item[key] !== undefined && item[key] !== null;
          if (value.$exists !== exists) return false;
        } else if (value.$ne !== undefined) {
          if (item[key] === value.$ne) return false;
        } else if (value.$gte !== undefined) {
          if (item[key] < value.$gte) return false;
        } else if (value.$lt !== undefined) {
          if (item[key] >= value.$lt) return false;
        } else if (value.$size !== undefined) {
          if (!Array.isArray(item[key]) || item[key].length !== value.$size) return false;
        } else if (value.$in) {
          if (!value.$in.includes(item[key])) return false;
        } else {
          // Nested object query
          if (!this.matchesQuery(item[key], value)) return false;
        }
      } else {
        if (item[key] !== value) return false;
      }
    }
    return true;
  }

  generateId() {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  // Aggregation-like methods for dashboard stats
  async aggregate(pipeline) {
    let data = await this.readData();

    for (const stage of pipeline) {
      if (stage.$match) {
        data = data.filter(item => this.matchesQuery(item, stage.$match));
      } else if (stage.$group) {
        const groups = {};
        data.forEach(item => {
          const groupKey = this.getGroupKey(item, stage.$group._id);
          if (!groups[groupKey]) {
            groups[groupKey] = { _id: groupKey };
            // Initialize accumulators
            Object.keys(stage.$group).forEach(key => {
              if (key !== '_id') {
                if (stage.$group[key].$sum) {
                  groups[groupKey][key.replace('$', '')] = 0;
                } else if (stage.$group[key].$push) {
                  groups[groupKey][key.replace('$', '')] = [];
                }
              }
            });
          }

          // Accumulate values
          Object.keys(stage.$group).forEach(key => {
            if (key !== '_id') {
              const fieldName = key.replace('$', '');
              if (stage.$group[key].$sum === 1) {
                groups[groupKey][fieldName]++;
              } else if (stage.$group[key].$sum) {
                const value = this.getNestedValue(item, stage.$group[key].$sum.replace('$', ''));
                groups[groupKey][fieldName] += value || 0;
              } else if (stage.$group[key].$push) {
                const value = this.getNestedValue(item, stage.$group[key].$push.replace('$', ''));
                groups[groupKey][fieldName].push(value);
              }
            }
          });
        });
        data = Object.values(groups);
      } else if (stage.$project) {
        data = data.map(item => {
          const projected = {};
          Object.keys(stage.$project).forEach(key => {
            if (stage.$project[key] === 1) {
              projected[key] = item[key];
            } else if (typeof stage.$project[key] === 'object') {
              projected[key] = this.evaluateProjection(item, stage.$project[key]);
            }
          });
          return projected;
        });
      } else if (stage.$sort) {
        data.sort((a, b) => {
          for (const [key, order] of Object.entries(stage.$sort)) {
            const aVal = this.getNestedValue(a, key);
            const bVal = this.getNestedValue(b, key);
            if (aVal < bVal) return order === 1 ? -1 : 1;
            if (aVal > bVal) return order === 1 ? 1 : -1;
          }
          return 0;
        });
      }
    }

    return data;
  }

  getGroupKey(item, groupId) {
    if (typeof groupId === 'string') {
      return this.getNestedValue(item, groupId.replace('$', ''));
    } else if (typeof groupId === 'object') {
      const key = {};
      Object.keys(groupId).forEach(k => {
        key[k] = this.getNestedValue(item, groupId[k].replace('$', ''));
      });
      return JSON.stringify(key);
    }
    return item._id || item.id;
  }

  getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  evaluateProjection(item, projection) {
    if (projection.$subtract) {
      const [a, b] = projection.$subtract.map(path => this.getNestedValue(item, path.replace('$', '')));
      return a - b;
    } else if (projection.$reduce) {
      const { input, initialValue, in: reduceExpr } = projection.$reduce;
      const array = this.getNestedValue(item, input.replace('$', ''));
      return array.reduce((acc, curr) => {
        // Simple reduce implementation for year distribution
        if (reduceExpr.$mergeObjects) {
          return { ...acc, [curr]: (acc[curr] || 0) + 1 };
        }
        return acc;
      }, initialValue);
    }
    return null;
  }
}

// Create service instances
const userService = new DataService('users');
const menuItemService = new DataService('menuItems');

module.exports = {
  DataService,
  userService,
  menuItemService
};
