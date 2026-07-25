import type { TransportAlert } from './chemTypes';

const TYPES: {
  type: string;
  typeKey: string;
  category: TransportAlert['category'];
}[] = [
  { type: '运输超时', typeKey: 'timeout', category: '时效类' },
  { type: '配送延误', typeKey: 'delay', category: '时效类' },
  { type: '签收超时', typeKey: 'sign_timeout', category: '时效类' },
  { type: '路线偏离', typeKey: 'route_dev', category: '路线类' },
  { type: '未按规定路线行驶', typeKey: 'route_illegal', category: '路线类' },
  { type: '温湿度超限', typeKey: 'temp', category: '环境/货况类' },
  { type: '包装破损', typeKey: 'pack', category: '环境/货况类' },
  { type: '货物泄漏', typeKey: 'leak', category: '环境/货况类' },
  { type: '车辆故障', typeKey: 'vehicle', category: '人车/单证类' },
  { type: '驾驶员违规', typeKey: 'driver', category: '人车/单证类' },
  { type: '单证不符', typeKey: 'doc', category: '人车/单证类' },
  { type: '系统数据异常', typeKey: 'system', category: '人车/单证类' },
];

const LOCS: { name: string; lat: number; lng: number }[] = [
  { name: '湛江东海岛石化大道', lat: 21.19, lng: 110.42 },
  { name: '湛江港调顺岛码头', lat: 21.27, lng: 110.42 },
  { name: '麻章区疏港高速', lat: 21.25, lng: 110.28 },
  { name: '坡头区南三岛道口', lat: 21.22, lng: 110.48 },
  { name: '徐闻进港公路', lat: 20.45, lng: 110.22 },
  { name: '雷州半岛 G15 出口', lat: 20.92, lng: 110.08 },
  { name: '遂溪物流园区', lat: 21.38, lng: 110.25 },
  { name: '吴川塘缀枢纽', lat: 21.42, lng: 110.78 },
  { name: '廉江九洲江大桥', lat: 21.62, lng: 110.28 },
  { name: '湛江综保区卡口', lat: 21.18, lng: 110.35 },
];

const STATUSES: TransportAlert['status'][] = [
  '待处理',
  '处理中',
  '已升级',
  '已解决',
];
const SEVERITIES: TransportAlert['severity'][] = ['高', '中', '低'];

function dayOffset(n: number): string {
  const d = new Date(2026, 6, 14);
  d.setDate(d.getDate() - (n % 7));
  const hh = 8 + (n % 10);
  const mm = (n * 7) % 60;
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
}

/** 30 条运输告警，覆盖 12 类异常 */
export const transportAlerts: TransportAlert[] = Array.from({ length: 30 }, (_, i) => {
  const t = TYPES[i % 12];
  const loc = LOCS[i % LOCS.length];
  const plate = `粤G-${String(10000 + ((i * 137) % 89999)).padStart(5, '0')}`;
  return {
    id: `TAL-${String(i + 1).padStart(3, '0')}`,
    type: t.type,
    typeKey: t.typeKey,
    category: t.category,
    vehicleNo: plate,
    location: loc.name,
    lat: loc.lat + (i % 5) * 0.01,
    lng: loc.lng + (i % 3) * 0.01,
    time: dayOffset(i),
    status: STATUSES[i % 4],
    severity: SEVERITIES[i % 3],
    description: `${t.type}：车辆 ${plate} 在${loc.name}触发告警，已自动推送调度中心。`,
  };
});

export const transportAlertCategories = [
  {
    key: 'time',
    label: '时效类',
    types: ['运输超时', '配送延误', '签收超时'],
  },
  {
    key: 'route',
    label: '路线类',
    types: ['路线偏离', '未按规定路线行驶'],
  },
  {
    key: 'env',
    label: '环境/货况类',
    types: ['温湿度超限', '包装破损', '货物泄漏'],
  },
  {
    key: 'ops',
    label: '人车/单证类',
    types: ['车辆故障', '驾驶员违规', '单证不符', '系统数据异常'],
  },
];
