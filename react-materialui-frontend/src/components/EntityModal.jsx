import React from 'react';
import { Modal, Box, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
};

const ModalComponent = ({ open, handleClose, FormComponent, entityData, title }) => {
    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={style}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6">
                        {entityData ? `Редактировать ${title}` : `Добавить ${title}`}
                    </Typography>
                    <IconButton onClick={handleClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>
                <FormComponent entityData={entityData} onClose={handleClose} />
            </Box>
        </Modal>
    );
};

export default ModalComponent;
