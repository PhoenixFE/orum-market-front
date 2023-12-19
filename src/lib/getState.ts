import _ from 'lodash';

export default function getState(orderList) {
  const state = {
    OS020: 0,
    OS030: 0,
    OS035: 0,
    OS040: 0,
  };

  let result = _.countBy(orderList, 'state');
  result = _.merge({}, state, result);

  const stateTitle = [
    {
      id: 1,
      title: '결제완료',
      count: result.OS020,
    },
    {
      id: 2,
      title: '배송준비중',
      count: result.OS030,
    },
    {
      id: 3,
      title: '배송중',
      count: result.OS035,
    },
    {
      id: 4,
      title: '배송완료',
      count: result.OS040,
    },
  ];

  return stateTitle;
}
