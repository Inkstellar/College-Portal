import { Paper, Box } from "@mui/material";

const FormContainer = ({ children }: { children: React.ReactNode }) => {
    return <Paper sx={{ maxWidth: 300 }}>
        <Box sx={{ p: 2 }}>
            {children}
        </Box>
    </Paper>;
};

export default FormContainer;
