import React, { useEffect, useState } from 'react';
import {
  Button,
  Box,
  Stack,
  Badge,
  CircularProgress,
  Card,
  CardActionArea,
  CardMedia,
  Typography,
  IconButton,
  DialogTitle,
  Dialog,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';
import { useFileUpload } from '../hooks/useFileUpload';

interface FilePreview {
  id: string;
  path: string;
}

interface FileUploadProps {
  originalFiles?: { id: string; path: string }[];
  onFilesChange: (files: FilePreview[]) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({
  originalFiles,
  onFilesChange,
}) => {
  const { filePreview, handleFileUpload, handleFileRemove, isUploading } =
    useFileUpload(originalFiles);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    if (filePreview) {
      onFilesChange(filePreview);
    }
    console.log('FilePreview useEffect', filePreview);
  }, []);

  useEffect(() => {
    if (filePreview) {
      onFilesChange(filePreview);
    }
  }, [filePreview]);

  const handleOpenDialog = (imagePath: string) => {
    setSelectedImage(imagePath);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        border: '1px solid #e0e0e0',
        borderRadius: '4px',
        padding: '16px',
      }}
    >
      <Button
        component="label"
        variant="outlined"
        startIcon={<CloudUploadIcon />}
        disabled={filePreview ? filePreview.length >= 10 : false}
      >
        사진 업로드
        <input
          hidden
          accept="image/*"
          multiple
          type="file"
          onChange={handleFileUpload}
          onClick={(event) => (event.currentTarget.value = '')}
        />
      </Button>
      {isUploading && (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      )}
      <Stack direction="row" spacing={2}>
        {filePreview &&
          filePreview.map((image, index) => (
            <Badge
              badgeContent={
                <CloseIcon
                  onClick={() => handleFileRemove(image.id)}
                  sx={{
                    fontSize: '1rem',
                    color: 'white',
                    backgroundColor: 'red',
                    borderRadius: '50%',
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: 'darkred',
                    },
                  }}
                />
              }
              overlap="circular"
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              key={image.id}
            >
              {' '}
              <div onClick={() => handleOpenDialog(image.path)} key={image.id}>
                <Card sx={{ width: 90, height: 90 }}>
                  <CardActionArea>
                    <CardMedia
                      component="img"
                      height="90"
                      image={image.path}
                      alt={`Preview ${index + 1}`}
                    />
                  </CardActionArea>
                </Card>
              </div>
            </Badge>
          ))}
      </Stack>
      <Box sx={{ alignSelf: 'center' }}>
        {filePreview && filePreview.length > 0 && (
          <Typography variant="caption">{`${filePreview.length}/10`}</Typography>
        )}
        <Dialog onClose={handleCloseDialog} open={openDialog}>
          <DialogTitle>
            사진 미리보기
            <IconButton
              aria-label="close"
              onClick={handleCloseDialog}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          {selectedImage && (
            <img
              src={selectedImage}
              alt={`Preview` + selectedImage}
              style={{ width: '100%' }}
            />
          )}
        </Dialog>
      </Box>
    </Box>
  );
};

export default FileUpload;
