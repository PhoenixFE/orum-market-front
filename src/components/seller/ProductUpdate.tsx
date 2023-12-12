import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Editor } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';

import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { IconButton, Stack } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

import { api } from '../../api/api';
import { CATEGORY, QUALITY } from '../../constants/index';
import { IProduct } from '../../type/index';

const initCreateData = {
  price: 0,
  shippingFees: 0,
  show: true,
  active: true,
  name: '',
  mainImages: [],
  content: '',
  createdAt: '',
  updatedAt: '',
  quantity: 1,
  buyQuantity: 0,
  extra: {
    isNew: true,
    isBest: true,
    category: ['H01', 'H0101'],
    sort: 0,
  },
};

export default function ProductUpdate() {
  const { id } = useParams();

  const [productData, setProductData] =
    useState<Partial<IProduct>>(initCreateData);
  const [filePreview, setFilePreview] = useState([]);
  const editorRef = useRef();

  const handleMoveBack = () => {
    window.history.back();
  };

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    try {
      const response = await api.getProduct(Number(id));
      setProductData(response.data.item);

      setFilePreview(
        response.data.item.mainImages.map((image) => ({
          id: image.id,
          path: image.path,
        })),
      );
    } catch (error) {
      console.log('제품불러오기실패', error);
    }
  };

  //   console.log(
  //     '상품이미지 경로',
  //     filePreview.map((item) => ({
  //       item: item.path,
  //     })),
  //   );

  const updateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.updateProduct(id!, productData);
      alert('상품 수정이 완료되었습니다.');
      window.history.back();
    } catch (error) {
      console.log('상품수정오류', error);
    }
  };

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    const fileInput = e.target.files;
    if (!fileInput) return;

    const totalFiles = filePreview.length + fileInput.length;

    if (totalFiles > 3) {
      alert('이미지는 3개까지 첨부가능합니다');
      return;
    }

    const formData = new FormData();

    for (let i = 0; i < fileInput.length; i++) {
      formData.append('attach', fileInput[i]);
    }

    try {
      const response = await api.uploadFile(formData);

      //파일이 여러개일때
      if (response.data.files) {
        let fileArr = response.data.files;
        const resImgUrl = fileArr.map((images) => ({
          id: images.name,
          path: `https://localhost:443${images.path}`,
        }));
        setFilePreview([...filePreview, ...resImgUrl]);
        setProductData({
          ...productData,
          mainImages: [...filePreview, ...resImgUrl],
        });

        //단일파일일때
      } else {
        let fileArr = {
          id: response.data.file.name,
          path: `https://localhost:443${response.data.file.path}`,
        };

        setFilePreview([...filePreview, fileArr]);
        setProductData({
          ...productData,
          mainImages: [...filePreview, fileArr],
        });
      }
    } catch (error) {
      console.log('사진첨부에러발생', error);
    }
  };
  const handleFileRemove = (idToRemove) => {
    setFilePreview((prevPreview) =>
      prevPreview.filter((item) => item.id !== idToRemove),
    );
    setProductData((prevData) => ({
      ...prevData,
      mainImages: prevData.mainImages.filter((item) => item.id !== idToRemove),
    }));
  };

  const findDBName = (dbCode) => {
    const foundCategory = CATEGORY.depth2.find(
      (Category) => Category.dbCode === dbCode,
    );
    return console.log(
      '카테고리 이름',
      foundCategory ? foundCategory.dbName : '',
    );
  };
  const contentChange = () => {
    const editorData = editorRef.current.getInstance().getMarkdown();
    setProductData({
      ...productData,
      content: editorData,
    });
  };

  return (
    <>
      <form onSubmit={updateSubmit}>
        <>
          <InputLabel>상품사진</InputLabel>
          <h3>이미지는 3개까지 첨부 가능합니다.</h3>
          <Button
            component="label"
            variant="contained"
            startIcon={<CloudUploadIcon />}
            onChange={handleFileUpload}
          >
            파일 업로드
            <input hidden type="file" multiple accept="image/*" />
          </Button>
          {filePreview.map((item) => (
            <div key={item.id}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <IconButton
                  aria-label="delete"
                  size="large"
                  onClick={() => handleFileRemove(item.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </Stack>
              <img
                key={item.id}
                src={item.path}
                alt={'File Preview'}
                style={{ marginTop: '10px', maxWidth: '60%' }}
              />
            </div>
          ))}
        </>
        <br />
        <br />
        <InputLabel id="category-label">카테고리</InputLabel>
        <Select
          labelId="category-label"
          id="category-select"
          label="category"
          sx={{ width: '100px' }}
          value={productData.extra?.category[1] || ''}
          onChange={(e) => {
            const selectedDBCode = e.target.value;
            const selectedDBName = findDBName(selectedDBCode);
            setProductData((prevData) => ({
              ...prevData,
              extra: {
                ...prevData.extra,
                category: ['H01', selectedDBCode],
              },
            }));
          }}
        >
          {CATEGORY.depth2.map((menu) => (
            <MenuItem key={menu.id} value={menu.dbCode}>
              {menu.name}
            </MenuItem>
          ))}
        </Select>
        <br />
        <br />
        <>
          상품 품질:
          <FormControl>
            <InputLabel id="quantity-label">상품 품질</InputLabel>
            <Select
              labelId="quantity-label"
              id="quantity-select"
              label="quantity"
              value={
                productData.quantity >= 5 ? '2' : productData.quantity || ''
              }
              sx={{ width: '100px' }}
              onChange={(e) => {
                setProductData((prevData) => ({
                  ...prevData,
                  quantity: e.target.value,
                }));
              }}
            >
              {QUALITY.map((menu) => {
                return (
                  <MenuItem key={menu.id} value={menu.dbCode}>
                    {menu.name}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </>
        <br />
        <br />
        <>
          상품명:
          <TextField
            type="text"
            name="name"
            value={productData.name}
            onChange={(e) => {
              setProductData((prevData) => ({
                ...prevData,
                name: e.target.value,
              }));
            }}
          ></TextField>
        </>
        <br />
        <br />
        <>
          상품 가격:
          <TextField
            type="text"
            name="price"
            value={productData.price || ''}
            onChange={(e) => {
              setProductData((prevData) => ({
                ...prevData,
                price: e.target.value,
              }));
            }}
          ></TextField>
          {/* {numberError && <div style={{ color: 'red' }}>{numberError}</div>} */}
        </>
        <br />
        <br />
        <>
          배송비:
          <TextField
            type="text"
            name="shippingFees"
            value={productData.shippingFees || ''}
            onChange={(e) => {
              setProductData((prevData) => ({
                ...prevData,
                shippingFees: e.target.value,
              }));
            }}
          ></TextField>
          {/* {numberError && <div style={{ color: 'red' }}>{numberError}</div>} */}
        </>
        <br />
        <br />
        <>
          상품 설명:
          {productData.content && (
            <Editor
              ref={editorRef}
              initialValue={productData.content}
              previewStyle="vertical"
              height="400px"
              width="100%"
              initialEditType="markdown"
              useCommandShortcut={true}
              onChange={contentChange}
            />
          )}
          {/* 상품 설명을 10글자 이상 해야합니다 */}
          {/* {contentError && <div style={{ color: 'red' }}>{contentError}</div>} */}
        </>
        <br />
        <Button type="submit" variant="contained">
          등록하기
        </Button>
      </form>
      <Button type="button" variant="outlined" onClick={handleMoveBack}>
        취소
      </Button>
    </>
  );
}
