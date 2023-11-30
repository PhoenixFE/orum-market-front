import * as React from 'react';
import { Link, Outlet } from 'react-router-dom';
const _id = localStorage.getItem('_id');
export default function SellerOrderList() {
  return (
    <div>
      SellerOrderList
      <Link to={`/user/${_id}/product-create`}>
        <button>등록하기</button>
      </Link>
    </div>
  );
}
