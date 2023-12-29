import { Box, ImageList, ImageListItem, Skeleton } from '@mui/material';
import { useState } from 'react';
import { IProductImage } from '../../type';

const ProductImageGallery = ({ images }: { images: IProductImage[] }) => {
  const [selectedImage, setSelectedImage] = useState(
    images && images[0] ? images[0].path : '',
  );

  const imageContainerStyle = {
    overflow: 'hidden',
    position: 'relative',
    width: '100%',
    paddingTop: '100%',
    margin: '10px 10px',
  };
  const imageListStyle = {
    width: '100%',
    height: '100%',
  };

  interface OverlaySkeletonProps {
    imageUrl?: string;
  }

  const OverlaySkeleton: React.FC<OverlaySkeletonProps> = ({ imageUrl }) => {
    return (
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          paddingTop: '100%',
          overflow: 'hidden',
          height: 0,
          margin: '10px 10px',
        }}
      >
        <Skeleton
          variant="rectangular"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'gray',
          }}
        />

        {imageUrl && (
          <Box
            component="img"
            src={imageUrl}
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '80%',
              height: 'auto',
              opacity: 0.7,
            }}
          />
        )}
      </Box>
    );
  };

  return (
    <Box
      sx={{
        margin: '4px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {(!images || images.length === 0) && (
        <>
          <OverlaySkeleton imageUrl="../../assets/orum-favicon-orange.png" />
        </>
      )}

      {images.length > 0 && (
        <>
          <Box sx={imageContainerStyle}>
            <img
              src={selectedImage}
              alt="Selected-Image"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </Box>
          <ImageList sx={imageListStyle} cols={3} gap={9}>
            {images.map((image, index) => (
              <ImageListItem key={index}>
                <img
                  src={image.path}
                  alt={`Product ${image.id}`}
                  loading="lazy"
                  onClick={() => setSelectedImage(image.path)}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    cursor: 'pointer',
                    border:
                      selectedImage === image.path ? '2px solid #EF5B2A' : '',
                    filter:
                      selectedImage === image.path ? '' : 'brightness(0.5)',
                  }}
                />
              </ImageListItem>
            ))}
          </ImageList>
        </>
      )}
    </Box>
  );
};

export default ProductImageGallery;
