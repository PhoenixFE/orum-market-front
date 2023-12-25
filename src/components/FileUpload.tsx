import React, { useEffect, useState } from 'react';
import ImageUploading, { ImageListType } from 'react-images-uploading';
import {
  Button,
  Box,
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
  images: ImageListType;
  setImages: (images: ImageListType) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({
  originalFiles,
  onFilesChange,
  images,
  setImages,
}) => {
  const { filePreview, isUploading } = useFileUpload(originalFiles);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  // const [images, setImages] = useState(originalFiles || []);
  const maxNumber = 69;

  const onChange = (imageList: ImageListType) => {
    setImages(imageList as never[]);

    const filePreviews: FilePreview[] = imageList.map((image) => ({
      id: image.file?.name || 'unknown',
      path: image.dataURL || '',
    }));
    onFilesChange(filePreviews);
  };

  useEffect(() => {
    if (originalFiles && originalFiles.length > 0) {
      const formattedFiles = originalFiles.map((file) => ({
        ...file,
        dataURL: file.path,
      }));

      setImages(formattedFiles as never[]);
    }
  }, [originalFiles]);

  const handleOpenDialog = (imagePath: string) => {
    setSelectedImage(imagePath);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  console.log('filePreview', filePreview);
  console.log('originalFiles', originalFiles);
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        border: '1px solid #e0e0e0',
        borderRadius: '0',
        padding: '16px',
      }}
    >
      사진 업로드: 10장까지 업로드 가능합니다.
      {isUploading && (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      )}
      <ImageUploading
        multiple
        value={images}
        onChange={onChange}
        maxNumber={maxNumber}
      >
        {({
          imageList,
          onImageUpload,
          onImageRemoveAll,
          onImageUpdate,
          onImageRemove,
          isDragging,
          dragProps,
        }) => (
          <div className="upload__image-wrapper">
            <Button
              style={isDragging ? { color: 'red' } : undefined}
              sx={{ height: '100px' }}
              fullWidth
              variant="outlined"
              startIcon={<CloudUploadIcon />}
              onClick={onImageUpload}
              {...dragProps}
            >
              클릭하거나 이곳으로 사진을 드래그하세요
            </Button>
            &nbsp;
            <Button variant="text" onClick={onImageRemoveAll}>
              전체 삭제
            </Button>
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 2,
              }}
            >
              {imageList.map((image, index) => (
                <div key={index} className="image-item">
                  <Box gap={1}>
                    <Badge
                      badgeContent={
                        <CloseIcon
                          onClick={() => onImageRemove(index)}
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
                      <div
                        onClick={() => {
                          if (typeof image.dataURL === 'string') {
                            handleOpenDialog(image.dataURL);
                          }
                        }}
                        key={image.id}
                      >
                        <Card sx={{ width: 90, height: 90 }}>
                          <CardActionArea>
                            <CardMedia
                              component="img"
                              height="90"
                              image={image.dataURL}
                              alt={`Preview ${index + 1}`}
                            />
                          </CardActionArea>
                        </Card>
                      </div>{' '}
                    </Badge>
                  </Box>
                  <Button onClick={() => onImageUpdate(index)} variant="text">
                    수정
                  </Button>
                </div>
              ))}
            </Box>
          </div>
        )}
      </ImageUploading>
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
