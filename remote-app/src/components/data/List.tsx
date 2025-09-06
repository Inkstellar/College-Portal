import React from 'react';
import {
  List as MuiList,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemAvatar,
  Avatar,
  ListItemButton,
  Typography,
  Divider,
} from '@mui/material';

export interface ListItemData {
  id: string | number;
  primary: string;
  secondary?: string;
  icon?: React.ReactNode;
  avatar?: string;
  onClick?: () => void;
}

export interface ListProps {
  items: ListItemData[];
  dense?: boolean;
  dividers?: boolean;
  selectable?: boolean;
}

export const List: React.FC<ListProps> = ({
  items,
  dense = false,
  dividers = false,
  selectable = false,
}) => {
  const [selectedIndex, setSelectedIndex] = React.useState<number>(-1);

  const handleListItemClick = (index: number, onClick?: () => void) => {
    if (selectable) {
      setSelectedIndex(index);
    }
    onClick?.();
  };

  const renderListItem = (item: ListItemData, index: number) => {
    const itemContent = (
      <>
        {item.avatar && (
          <ListItemAvatar>
            <Avatar src={item.avatar} />
          </ListItemAvatar>
        )}
        {item.icon && <ListItemIcon>{item.icon}</ListItemIcon>}
        <ListItemText
          primary={item.primary}
          secondary={
            item.secondary && (
              <Typography
                component="span"
                variant="body2"
                color="text.secondary"
              >
                {item.secondary}
              </Typography>
            )
          }
        />
      </>
    );

    return selectable ? (
      <ListItemButton
        key={item.id}
        selected={selectedIndex === index}
        onClick={() => handleListItemClick(index, item.onClick)}
      >
        {itemContent}
      </ListItemButton>
    ) : (
      <ListItem key={item.id} onClick={() => item.onClick?.()}>
        {itemContent}
      </ListItem>
    );
  };

  return (
    <MuiList dense={dense}>
      {items.map((item, index) => (
        <React.Fragment key={item.id}>
          {renderListItem(item, index)}
          {dividers && index < items.length - 1 && <Divider />}
        </React.Fragment>
      ))}
    </MuiList>
  );
};
