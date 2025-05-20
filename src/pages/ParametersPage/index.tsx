import { Button, Checkbox, Col, Flex, Form, Input, InputNumber, Popconfirm, Row, Select, Table, Tabs, type TabsProps } from 'antd';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { type ColumnsType } from 'antd/es/table';
import Title from 'antd/es/typography/Title';
import { formatMoney, formatValue } from '../../services/format';
import LayoutPage from '../LayoutPage';
import type SelectOptionResponse from '../../types/SelectOptionResponse';
import type ParametersRequest from '../../types/ParametersRequest';
import { useApi } from '../../hooks/useApi';
import { useNotification } from '../../hooks/useNotification';

interface BodyPartDamage {
  name: string;
  damageMultiplier: number;
};

interface PremiumItem {
  name: string;
  value: number;
};

interface FishingItemChance {
  percentage: number;
  itemTemplateName: string;
};

interface WeaponInfo {
  name: string;
  recoil: number;
  damage: number;
  ammoItemTemplateName: string;
  attachToBody: boolean;
  components: WeaponComponent[];
}

interface WeaponComponent {
  itemTemplateName: string;
};

interface VehicleDismantlingPartsChance {
  percentage: number;
  quantity: number;
};

interface AudioRadioStation {
  name: string;
  url: string;
};

interface PremiumPointPackage {
  name: string;
  quantity: number;
  originalValue: number;
  value: number;
}

const ParametersPage = () => {
  const api = useApi();
  const [parameter, setParameter] = useState<ParametersRequest>({
    announcementValue: 0,
    barberValue: 0,
    blackout: false,
    clothesValue: 0,
    cooldownDismantleHours: 0,
    cooldownPropertyRobberyPropertyHours: 0,
    cooldownPropertyRobberyRobberHours: 0,
    driverLicenseBuyValue: 0,
    driverLicenseRenewValue: 0,
    endTimeCrackDen: 0,
    extraPaymentGarbagemanValue: 0,
    firefightersBlockHeal: 0,
    fuelValue: 0,
    hospitalValue: 0,
    initialTimeCrackDen: 0,
    ipLsJSON: '[]',
    keyValue: 0,
    lockValue: 0,
    maxCharactersOnline: 0,
    paycheck: 0,
    policeOfficersPropertyRobbery: 0,
    propertyRobberyConnectedTime: 0,
    tattooValue: 0,
    propertyProtectionLevelPercentageValue: 0,
    vehicleDismantlingMinutes: 0,
    vehicleDismantlingPartsChanceJSON: '[]',
    vehicleDismantlingPercentageValue: 0,
    vehicleDismantlingSeizedDays: 0,
    plasticSurgeryValue: 0,
    whoCanLogin: 1,
    fishingItemsChanceJSON: '[]',
    vehicleInsurancePercentage: 0,
    prisonInsideDimension: 0,
    prisonInsidePosX: 0,
    prisonInsidePosY: 0,
    prisonInsidePosZ: 0,
    prisonOutsideDimension: 0,
    prisonOutsidePosX: 0,
    prisonOutsidePosY: 0,
    prisonOutsidePosZ: 0,
    weaponsInfosJSON: '[]',
    bodyPartsDamagesJSON: '[]',
    weaponLicenseMaxAmmo: 0,
    weaponLicenseMaxAttachment: 0,
    weaponLicenseMaxWeapon: 0,
    weaponLicenseMonths: 0,
    weaponLicensePurchaseDaysInterval: 0,
    premiumItemsJSON: '[]',
    audioRadioStationsJSON: '[]',
    unemploymentAssistance: 0,
    premiumPointPackagesJSON: '[]',
    motd: '',
  });
  const [loading, setLoading] = useState(true);
  const [ipls, setIpls] = useState<string[]>([]);

  const [vehicleDismantlingPartsChance, setVehicleDismantlingPartsChance] = useState<VehicleDismantlingPartsChance>({
    percentage: 0,
    quantity: 0,
  });
  const [vehicleDismantlingPartsChances, setVehicleDismantlingPartsChances] = useState<VehicleDismantlingPartsChance[]>([]);

  const [fishingItemChance, setFishingItemChance] = useState<FishingItemChance>({
    percentage: 0,
    itemTemplateName: '',
  });
  const [fishingItemsChances, setFishingItemsChances] = useState<FishingItemChance[]>([]);

  const [weaponInfo, setWeaponInfo] = useState<WeaponInfo>({
    name: '',
    recoil: 0,
    damage: 0,
    ammoItemTemplateName: '',
    attachToBody: false,
    components: [],
  });
  const [weaponsInfos, setWeaponsInfos] = useState<WeaponInfo[]>([]);

  const [bodyPartDamage, setBodyPartDamage] = useState<BodyPartDamage>({
    name: '',
    damageMultiplier: 0,
  });
  const [bodyPartsDamages, setBodyPartsDamages] = useState<BodyPartDamage[]>([]);

  const [premiumItems, setPremiumItems] = useState<PremiumItem[]>([]);
  const [premiumItem, setPremiumItem] = useState<PremiumItem>({
    name: '',
    value: 0,
  });

  const [audioRadioStations, setAudioRadioStations] = useState<AudioRadioStation[]>([]);
  const [audioRadioStation, setAudioRadioStation] = useState<AudioRadioStation>({
    name: '',
    url: '',
  });

  const [premiumPointPackages, setPremiumPointPackages] = useState<PremiumPointPackage[]>([]);
  const [premiumPointPackage, setPremiumPointPackage] = useState<PremiumPointPackage>({
    name: '',
    quantity: 0,
    value: 0,
    originalValue: 0,
  });

  const [whoCanLogin, setWhoCanLogin] = useState<SelectOptionResponse[]>([]);
  const notification = useNotification();

  useEffect(() => {
    getParameters();
  }, []);

  const getParameters = () => {
    setLoading(true);
    Promise.all([api.getWhoCanLogin(), api.getParameters()])
      .then(([whoCanLogin, parameters]) => {
        setWhoCanLogin(whoCanLogin);
        setParameter(parameters);
        setIpls(JSON.parse(parameters.ipLsJSON));
        setVehicleDismantlingPartsChances(JSON.parse(parameters.vehicleDismantlingPartsChanceJSON));
        setFishingItemsChances(JSON.parse(parameters.fishingItemsChanceJSON));
        setWeaponsInfos(JSON.parse(parameters.weaponsInfosJSON));
        setBodyPartsDamages(JSON.parse(parameters.bodyPartsDamagesJSON));
        setPremiumItems(JSON.parse(parameters.premiumItemsJSON));
        setAudioRadioStations(JSON.parse(parameters.audioRadioStationsJSON));
        setPremiumPointPackages(JSON.parse(parameters.premiumPointPackagesJSON));
      })
      .catch((res) => {
        notification.alert('error', res);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleOk = () => {
    setLoading(true);
    api.saveParameters(parameter)
      .then(() => {
        notification.alert('success', 'Parâmetros gravados com sucesso.');
      })
      .catch(res => {
        notification.alert('error', res);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const inputStyle = {
    width: '100%',
  };

  const handleSelectIpls = (value: string[]) => {
    setIpls(value);
    setParameter({ ...parameter, ipLsJSON: JSON.stringify(value) });
  };

  const addVehicleDismantlingPartsChance = () => {
    setVehicleDismantlingPartsChances(old => [...old.filter(x => x.percentage !== vehicleDismantlingPartsChance.percentage), vehicleDismantlingPartsChance]);
    setVehicleDismantlingPartsChance({
      percentage: 0,
      quantity: 0,
    });
  };

  const deleteVehicleDismantlingPartsChance = (record: VehicleDismantlingPartsChance) => {
    setVehicleDismantlingPartsChances(old => old.filter(x => x.percentage !== record.percentage));
  };

  useEffect(() => {
    setParameter({ ...parameter, vehicleDismantlingPartsChanceJSON: JSON.stringify(vehicleDismantlingPartsChances) });
  }, [vehicleDismantlingPartsChances]);

  const columnsVehicleDismantlingPartsChances: ColumnsType<VehicleDismantlingPartsChance> = [
    {
      title: t('percentage'),
      dataIndex: 'percentage',
      key: 'percentage',
      render: (percentage: number) => formatValue(percentage),
    },
    {
      title: t('quantity'),
      dataIndex: 'quantity',
      key: 'quantity',
      render: (quantity: number) => formatValue(quantity),
    },
    {
      title: t('options'),
      dataIndex: 'id',
      key: 'options',
      align: 'center',
      render: (_, record: VehicleDismantlingPartsChance) =>
        <Popconfirm
          title={t('deleteRecord')}
          description={t('deleteRecordConfirm')}
          onConfirm={() => deleteVehicleDismantlingPartsChance(record)}
          okText={t('yes')}
          cancelText={t('no')}
        >
          <Button size='small' danger>{t('delete')}</Button>
        </Popconfirm>,
    },
  ];

  const addFishingItemChance = () => {
    setFishingItemsChances(old => [...old.filter(x => x.percentage !== fishingItemChance.percentage), fishingItemChance]);
    setFishingItemChance({
      percentage: 0,
      itemTemplateName: '',
    });
  };

  const deleteFishingItemChance = (record: FishingItemChance) => {
    setFishingItemsChances(old => old.filter(x => x.percentage !== record.percentage));
  };

  useEffect(() => {
    setParameter({ ...parameter, fishingItemsChanceJSON: JSON.stringify(fishingItemsChances) });
  }, [fishingItemsChances]);

  const columnsFishingItemsChances: ColumnsType<FishingItemChance> = [
    {
      title: t('percentage'),
      dataIndex: 'percentage',
      key: 'percentage',
      render: (percentage: number) => formatValue(percentage, 2),
    },
    {
      title: t('name'),
      dataIndex: 'itemTemplateName',
      key: 'itemTemplateName',
    },
    {
      title: t('options'),
      dataIndex: 'id',
      key: 'options',
      align: 'center',
      render: (_, record: FishingItemChance) =>
        <Popconfirm
          title={t('deleteRecord')}
          description={t('deleteRecordConfirm')}
          onConfirm={() => deleteFishingItemChance(record)}
          okText={t('yes')}
          cancelText={t('no')}
        >
          <Button size='small' danger>{t('delete')}</Button>
        </Popconfirm>,
    },
  ];

  const addWeaponInfo = () => {
    const index = weaponsInfos.findIndex(x => x.name === weaponInfo.name);
    if (index !== -1)
      setWeaponsInfos(old => old.map((value, i) => i === index ? weaponInfo : value));
    else
      setWeaponsInfos(old => [...old, weaponInfo]);

    setWeaponInfo({
      name: '',
      recoil: 0,
      damage: 0,
      ammoItemTemplateName: '',
      attachToBody: false,
      components: [],
    });
  };

  const deleteWeaponInfo = (record: WeaponInfo) => {
    setWeaponsInfos(old => old.filter(x => x.name !== record.name));
  };

  useEffect(() => {
    setParameter({ ...parameter, weaponsInfosJSON: JSON.stringify(weaponsInfos) });
  }, [weaponsInfos]);

  const columnsWeaponRecoils: ColumnsType<WeaponInfo> = [
    {
      title: t('name'),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: t('recoil'),
      dataIndex: 'recoil',
      key: 'recoil',
      render: (recoil: number) => formatValue(recoil, 1),
    },
    {
      title: t('damage'),
      dataIndex: 'damage',
      key: 'damage',
      render: (damage: number) => formatValue(damage),
    },
    {
      title: t('ammo'),
      dataIndex: 'ammoItemTemplateName',
      key: 'ammoItemTemplateName',
    },
    {
      title: t('attachToBody'),
      dataIndex: 'attachToBody',
      key: 'attachToBody',
      render: (attachToBody: boolean) => t(attachToBody ? 'yes' : 'no'),
    },
    {
      title: t('components'),
      dataIndex: 'components',
      key: 'components',
      render: (components: WeaponComponent[]) => components.map(x => x.itemTemplateName).join(', '),
    },
    {
      title: t('options'),
      dataIndex: 'id',
      key: 'options',
      align: 'center',
      render: (_, record: WeaponInfo) => <Flex justify='space-evenly'>
        <Button size='small' onClick={() => setWeaponInfo(record)}>{t('edit')}</Button>
        <Popconfirm
          title={t('deleteRecord')}
          description={t('deleteRecordConfirm')}
          onConfirm={() => deleteWeaponInfo(record)}
          okText={t('yes')}
          cancelText={t('no')}
        >
          <Button size='small' danger>{t('delete')}</Button>
        </Popconfirm>
      </Flex>,
    },
  ];

  const editBodyPartDamage = () => {
    setBodyPartsDamages(old => old.map((value, i) => i === old.findIndex(x => x.name === bodyPartDamage.name) ? bodyPartDamage : value));
  };

  useEffect(() => {
    setParameter({ ...parameter, bodyPartsDamagesJSON: JSON.stringify(bodyPartsDamages) });
  }, [bodyPartsDamages]);

  const columnsBodyPartsDamages: ColumnsType<BodyPartDamage> = [
    {
      title: t('name'),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: t('damageMultiplier'),
      dataIndex: 'damageMultiplier',
      key: 'damageMultiplier',
      render: (damageMultiplier: number) => formatValue(damageMultiplier, 2),
    },
    {
      title: t('options'),
      dataIndex: 'id',
      key: 'options',
      align: 'center',
      render: (_, record: BodyPartDamage) => <Button size='small' onClick={() => setBodyPartDamage(record)}>{t('edit')}</Button>,
    },
  ];

  const editPremiumItem = () => {
    setPremiumItems(old => old.map((value, i) => i === old.findIndex(x => x.name === premiumItem.name) ? premiumItem : value));
  };

  useEffect(() => {
    setParameter({ ...parameter, premiumItemsJSON: JSON.stringify(premiumItems) });
  }, [premiumItems]);

  const columnsPremiumItems: ColumnsType<PremiumItem> = [
    {
      title: t('name'),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: t('value'),
      dataIndex: 'value',
      key: 'value',
      render: (value: number) => formatValue(value),
    },
    {
      title: t('options'),
      dataIndex: 'id',
      key: 'options',
      align: 'center',
      render: (_, record: PremiumItem) => <Button size='small' onClick={() => setPremiumItem(record)}>{t('edit')}</Button>,
    },
  ];

  const editAudioRationStation = () => {
    setAudioRadioStations(old => [...old.filter(x => x.name !== audioRadioStation.name), audioRadioStation]);
    setAudioRadioStation({
      name: '',
      url: '',
    });
  };

  const deleteAudioRationStation = (record: AudioRadioStation) => {
    setAudioRadioStations(old => old.filter(x => x.name !== record.name));
  };

  useEffect(() => {
    setParameter({ ...parameter, audioRadioStationsJSON: JSON.stringify(audioRadioStations) });
  }, [audioRadioStations]);

  const columnsAudioRadioStations: ColumnsType<AudioRadioStation> = [
    {
      title: t('name'),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: t('url'),
      dataIndex: 'url',
      key: 'url',
    },
    {
      title: t('options'),
      dataIndex: 'id',
      key: 'options',
      align: 'center',
      render: (_, record: AudioRadioStation) => <Flex justify='space-evenly'>
        <Button size='small' onClick={() => setAudioRadioStation(record)}>{t('edit')}</Button>
        <Popconfirm
          title={t('deleteRecord')}
          description={t('deleteRecordConfirm')}
          onConfirm={() => deleteAudioRationStation(record)}
          okText={t('yes')}
          cancelText={t('no')}
        >
          <Button size='small'>{t('delete')}</Button>
        </Popconfirm>
      </Flex>,
    },
  ];

  const editPremiumPointPackage = () => {
    setPremiumPointPackages(old => [...old.filter(x => x.name !== premiumPointPackage.name), premiumPointPackage]);
    setPremiumPointPackage({
      name: '',
      quantity: 0,
      originalValue: 0,
      value: 0,
    });
  };

  const deletePremiumPointPackage = (record: PremiumPointPackage) => {
    setPremiumPointPackages(old => old.filter(x => x.name !== record.name));
  };

  useEffect(() => {
    setParameter({ ...parameter, premiumPointPackagesJSON: JSON.stringify(premiumPointPackages) });
  }, [premiumPointPackages]);

  const columnsPremiumPointPackages: ColumnsType<PremiumPointPackage> = [
    {
      title: t('name'),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: t('quantity'),
      dataIndex: 'quantity',
      key: 'quantity',
      render: (quantity: number) => formatValue(quantity),
    },
    {
      title: t('originalValue'),
      dataIndex: 'originalValue',
      key: 'originalValue',
      render: (originalValue: number) => formatMoney(originalValue),
    },
    {
      title: t('value'),
      dataIndex: 'value',
      key: 'value',
      render: (value: number) => formatMoney(value),
    },
    {
      title: t('options'),
      dataIndex: 'id',
      key: 'options',
      align: 'center',
      render: (_, record: PremiumPointPackage) => <Flex justify='space-evenly'>
        <Button size='small' onClick={() => setPremiumPointPackage(record)}>{t('edit')}</Button>
        <Popconfirm
          title={t('deleteRecord')}
          description={t('deleteRecordConfirm')}
          onConfirm={() => deletePremiumPointPackage(record)}
          okText={t('yes')}
          cancelText={t('no')}
        >
          <Button size='small' danger>{t('delete')}</Button>
        </Popconfirm>
      </Flex>,
    },
  ];

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: t('main'),
      children: <Form layout='vertical'>
        <Row gutter={16}>
          <Col xs={24} md={10} lg={6}>
            <Form.Item label={t('maxCharactersOnline')}>
              <Input value={parameter.maxCharactersOnline} disabled style={inputStyle} />
            </Form.Item>
          </Col>
          <Col xs={24} md={10} lg={6}>
            <Form.Item label={t('hospitalValue')}>
              <InputNumber value={parameter.hospitalValue} onChange={(value) => setParameter({ ...parameter, hospitalValue: value ?? 0 })} style={inputStyle} />
            </Form.Item>
          </Col>
          <Col xs={24} md={10} lg={6}>
            <Form.Item label={t('barberValue')}>
              <InputNumber value={parameter.barberValue} onChange={(value) => setParameter({ ...parameter, barberValue: value ?? 0 })} style={inputStyle} />
            </Form.Item>
          </Col>
          <Col xs={24} md={10} lg={6}>
            <Form.Item label={t('clothesValue')}>
              <InputNumber value={parameter.clothesValue} onChange={(value) => setParameter({ ...parameter, clothesValue: value ?? 0 })} style={inputStyle} />
            </Form.Item>
          </Col>
          <Col xs={24} md={10} lg={4}>
            <Form.Item label={t('driverLicenseBuyValue')}>
              <InputNumber value={parameter.driverLicenseBuyValue} onChange={(value) => setParameter({ ...parameter, driverLicenseBuyValue: value ?? 0 })} style={inputStyle} />
            </Form.Item>
          </Col>
          <Col xs={24} md={10} lg={5}>
            <Form.Item label={t('driverLicenseRenewValue')}>
              <InputNumber value={parameter.driverLicenseRenewValue} onChange={(value) => setParameter({ ...parameter, driverLicenseRenewValue: value ?? 0 })} style={inputStyle} />
            </Form.Item>
          </Col>
          <Col xs={24} md={10} lg={3}>
            <Form.Item label={t('fuelValue')}>
              <InputNumber value={parameter.fuelValue} onChange={(value) => setParameter({ ...parameter, fuelValue: value ?? 0 })} style={inputStyle} />
            </Form.Item>
          </Col>
          <Col xs={24} md={10} lg={3}>
            <Form.Item label={t('paycheck')}>
              <InputNumber value={parameter.paycheck} onChange={(value) => setParameter({ ...parameter, paycheck: value ?? 0 })} style={inputStyle} />
            </Form.Item>
          </Col>
          <Col xs={24} md={10} lg={3}>
            <Form.Item label={t('announcementValue')}>
              <InputNumber value={parameter.announcementValue} onChange={(value) => setParameter({ ...parameter, announcementValue: value ?? 0 })} style={inputStyle} />
            </Form.Item>
          </Col>
          <Col xs={24} md={10} lg={3}>
            <Form.Item label={t('extraPaymentGarbagemanValue')}>
              <InputNumber value={parameter.extraPaymentGarbagemanValue} onChange={(value) => setParameter({ ...parameter, extraPaymentGarbagemanValue: value ?? 0 })} style={inputStyle} />
            </Form.Item>
          </Col>
          <Col xs={24} md={20} lg={3}>
            <Form.Item label={t('keyValue')}>
              <InputNumber value={parameter.keyValue} onChange={(value) => setParameter({ ...parameter, keyValue: value ?? 0 })} style={inputStyle} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col xs={24} md={10} lg={4}>
            <Form.Item label={t('lockValue')}>
              <InputNumber value={parameter.lockValue} onChange={(value) => setParameter({ ...parameter, lockValue: value ?? 0 })} style={inputStyle} />
            </Form.Item>
          </Col>
          <Col xs={24} md={10} lg={4}>
            <Form.Item label={t('tattooValue')}>
              <InputNumber value={parameter.tattooValue} onChange={(value) => setParameter({ ...parameter, tattooValue: value ?? 0 })} style={inputStyle} />
            </Form.Item>
          </Col>
          <Col xs={24} md={10} lg={6}>
            <Form.Item label={t('initialTimeCrackDen')}>
              <InputNumber value={parameter.initialTimeCrackDen} onChange={(value) => setParameter({ ...parameter, initialTimeCrackDen: value ?? 0 })} style={inputStyle} />
            </Form.Item>
          </Col>
          <Col xs={24} md={10} lg={6}>
            <Form.Item label={t('endTimeCrackDen')}>
              <InputNumber value={parameter.endTimeCrackDen} onChange={(value) => setParameter({ ...parameter, endTimeCrackDen: value ?? 0 })} style={inputStyle} />
            </Form.Item>
          </Col>
          <Col xs={24} md={20} lg={4}>
            <Form.Item label={t('plasticSurgeryValue')}>
              <InputNumber value={parameter.plasticSurgeryValue} onChange={(value) => setParameter({ ...parameter, plasticSurgeryValue: value ?? 0 })} style={inputStyle} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col xs={24} md={10} lg={5}>
            <Form.Item label={t('firefightersBlockHeal')}>
              <InputNumber value={parameter.firefightersBlockHeal} onChange={(value) => setParameter({ ...parameter, firefightersBlockHeal: value ?? 0 })} style={inputStyle} />
            </Form.Item>
          </Col>
          <Col xs={24} md={10} lg={5}>
            <Form.Item label={t('propertyProtectionLevelPercentageValue')}>
              <InputNumber value={parameter.propertyProtectionLevelPercentageValue} onChange={(value) => setParameter({ ...parameter, propertyProtectionLevelPercentageValue: value ?? 0 })} style={inputStyle} />
            </Form.Item>
          </Col>
          <Col xs={24} md={10} lg={5}>
            <Form.Item label={t('vehicleInsurancePercentage')}>
              <InputNumber value={parameter.vehicleInsurancePercentage} onChange={(value) => setParameter({ ...parameter, vehicleInsurancePercentage: value ?? 0 })} style={inputStyle} />
            </Form.Item>
          </Col>
          <Col xs={24} md={10} lg={5}>
            <Form.Item label={t('whoCanLogin')}>
              <Select options={whoCanLogin} value={parameter.whoCanLogin} onChange={(value) => setParameter({ ...parameter, whoCanLogin: Number(value) })} style={inputStyle} />
            </Form.Item>
          </Col>
          <Col xs={24} md={20} lg={4}>
            <Form.Item label={t('unemploymentAssistance')}>
              <InputNumber value={parameter.unemploymentAssistance} onChange={(value) => setParameter({ ...parameter, unemploymentAssistance: value ?? 0 })} style={inputStyle} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label={t('ipls')}>
              <Select mode='tags' value={ipls} onChange={handleSelectIpls} style={inputStyle} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label={t('motd')}>
              <Input value={parameter.motd} onChange={(e) => setParameter({ ...parameter, motd: e.target.value })} style={inputStyle} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Checkbox checked={parameter.blackout} onChange={(e) => setParameter({ ...parameter, blackout: e.target.checked })}>{t('blackout')}</Checkbox>
          </Col>
        </Row>
      </Form>,
    },
    {
      key: '2',
      label: t('dismantle'),
      children: <Form layout='vertical'>
        <Row gutter={16}>
          <Col xs={24} md={10} lg={6}>
            <Form.Item label={t('cooldownDismantleHours')}>
              <InputNumber value={parameter.cooldownDismantleHours} onChange={(value) => setParameter({ ...parameter, cooldownDismantleHours: value ?? 0 })} style={inputStyle} />
            </Form.Item>
          </Col>
          <Col xs={24} md={10} lg={6}>
            <Form.Item label={t('vehicleDismantlingPercentageValue')}>
              <InputNumber value={parameter.vehicleDismantlingPercentageValue} onChange={(value) => setParameter({ ...parameter, vehicleDismantlingPercentageValue: value ?? 0 })} style={inputStyle} />
            </Form.Item>
          </Col>
          <Col xs={24} md={10} lg={6}>
            <Form.Item label={t('vehicleDismantlingSeizedDays')}>
              <InputNumber value={parameter.vehicleDismantlingSeizedDays} onChange={(value) => setParameter({ ...parameter, vehicleDismantlingSeizedDays: value ?? 0 })} style={inputStyle} />
            </Form.Item>
          </Col>
          <Col xs={24} md={10} lg={6}>
            <Form.Item label={t('vehicleDismantlingMinutes')}>
              <InputNumber value={parameter.vehicleDismantlingMinutes} onChange={(value) => setParameter({ ...parameter, vehicleDismantlingMinutes: value ?? 0 })} style={inputStyle} />
            </Form.Item>
          </Col>
        </Row>
        <Title level={3}>{t('vehicleDismantlingPartsChanceJSON')}</Title>
        <Row gutter={16}>
          <Col span={10}>
            <Form.Item label={t('percentage')}>
              <InputNumber value={vehicleDismantlingPartsChance.percentage}
                onChange={(value) => setVehicleDismantlingPartsChance({ ...vehicleDismantlingPartsChance, percentage: value ?? 0 })}
                style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={10}>
            <Form.Item label={t('quantity')}>
              <InputNumber value={vehicleDismantlingPartsChance.quantity}
                onChange={(value) => setVehicleDismantlingPartsChance({ ...vehicleDismantlingPartsChance, quantity: value ?? 0 })}
                style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col xs={24} md={10} lg={4}>
            <Form.Item label={' '}>
              <Button style={{ width: '100%' }} onClick={addVehicleDismantlingPartsChance}>{t('add')}</Button>
            </Form.Item>
          </Col>
        </Row>
        <Table
          columns={columnsVehicleDismantlingPartsChances}
          dataSource={vehicleDismantlingPartsChances}
          pagination={false}
          loading={loading}
        />
      </Form>,
    },
    {
      key: '3',
      label: t('fishing'),
      children: <Form layout='vertical'>
        <Title level={3}>{t('fishingItemsChanceJSON')}</Title>
        <Row gutter={16}>
          <Col span={10}>
            <Form.Item label={t('percentage')}>
              <InputNumber value={fishingItemChance.percentage}
                onChange={(value) => setFishingItemChance({ ...fishingItemChance, percentage: value ?? 0 })}
                style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={10}>
            <Form.Item label={t('name')}>
              <Input value={fishingItemChance.itemTemplateName}
                onChange={(e) => setFishingItemChance({ ...fishingItemChance, itemTemplateName: e.target.value })}
                style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col xs={24} md={10} lg={4}>
            <Form.Item label={' '}>
              <Button style={{ width: '100%' }} onClick={addFishingItemChance}>{t('add')}</Button>
            </Form.Item>
          </Col>
        </Row>
        <Table
          columns={columnsFishingItemsChances}
          dataSource={fishingItemsChances}
          pagination={false}
          loading={loading}
        />
      </Form>,
    },
    {
      key: '4',
      label: t('propertyRobbery'),
      children: <Form layout='vertical'>
        <Row gutter={16}>
          <Col xs={24} md={10} lg={6}>
            <Form.Item label={t('propertyRobberyConnectedTime')}>
              <InputNumber value={parameter.propertyRobberyConnectedTime} onChange={(value) => setParameter({ ...parameter, propertyRobberyConnectedTime: value ?? 0 })} style={inputStyle} />
            </Form.Item>
          </Col>
          <Col xs={24} md={10} lg={6}>
            <Form.Item label={t('cooldownPropertyRobberyRobberHours')}>
              <InputNumber value={parameter.cooldownPropertyRobberyRobberHours} onChange={(value) => setParameter({ ...parameter, cooldownPropertyRobberyRobberHours: value ?? 0 })} style={inputStyle} />
            </Form.Item>
          </Col>
          <Col xs={24} md={10} lg={6}>
            <Form.Item label={t('cooldownPropertyRobberyPropertyHours')}>
              <InputNumber value={parameter.cooldownPropertyRobberyPropertyHours} onChange={(value) => setParameter({ ...parameter, cooldownPropertyRobberyPropertyHours: value ?? 0 })} style={inputStyle} />
            </Form.Item>
          </Col>
          <Col xs={24} md={10} lg={6}>
            <Form.Item label={t('policeOfficersPropertyRobbery')}>
              <InputNumber value={parameter.policeOfficersPropertyRobbery} onChange={(value) => setParameter({ ...parameter, policeOfficersPropertyRobbery: value ?? 0 })} style={inputStyle} />
            </Form.Item>
          </Col>
        </Row>
      </Form>,
    },
    {
      key: t('prison'),
      label: t('prison'),
      children: <Form layout='vertical'>
        <Row gutter={16}>
          <Col xs={24} md={10} lg={6}>
            <Form.Item label={t('positionX')}>
              <InputNumber value={parameter.prisonInsidePosX} onChange={(value) => setParameter({ ...parameter, prisonInsidePosX: value ?? 0 })} style={inputStyle} />
            </Form.Item>
          </Col>
          <Col xs={24} md={10} lg={6}>
            <Form.Item label={t('positionY')}>
              <InputNumber value={parameter.prisonInsidePosY} onChange={(value) => setParameter({ ...parameter, prisonInsidePosY: value ?? 0 })} style={inputStyle} />
            </Form.Item>
          </Col>
          <Col xs={24} md={10} lg={6}>
            <Form.Item label={t('positionZ')}>
              <InputNumber value={parameter.prisonInsidePosZ} onChange={(value) => setParameter({ ...parameter, prisonInsidePosZ: value ?? 0 })} style={inputStyle} />
            </Form.Item>
          </Col>
          <Col xs={24} md={10} lg={6}>
            <Form.Item label={t('dimension')}>
              <InputNumber value={parameter.prisonInsideDimension} onChange={(value) => setParameter({ ...parameter, prisonInsideDimension: value ?? 0 })} style={inputStyle} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col xs={24} md={10} lg={6}>
            <Form.Item label={t('positionX')}>
              <InputNumber value={parameter.prisonOutsidePosX} onChange={(value) => setParameter({ ...parameter, prisonOutsidePosX: value ?? 0 })} style={inputStyle} />
            </Form.Item>
          </Col>
          <Col xs={24} md={10} lg={6}>
            <Form.Item label={t('positionY')}>
              <InputNumber value={parameter.prisonOutsidePosY} onChange={(value) => setParameter({ ...parameter, prisonOutsidePosY: value ?? 0 })} style={inputStyle} />
            </Form.Item>
          </Col>
          <Col xs={24} md={10} lg={6}>
            <Form.Item label={t('positionZ')}>
              <InputNumber value={parameter.prisonOutsidePosZ} onChange={(value) => setParameter({ ...parameter, prisonOutsidePosZ: value ?? 0 })} style={inputStyle} />
            </Form.Item>
          </Col>
          <Col xs={24} md={10} lg={6}>
            <Form.Item label={t('dimension')}>
              <InputNumber value={parameter.prisonOutsideDimension} onChange={(value) => setParameter({ ...parameter, prisonOutsideDimension: value ?? 0 })} style={inputStyle} />
            </Form.Item>
          </Col>
        </Row>
      </Form>,
    },
    {
      key: t('weapons'),
      label: t('weapons'),
      children: <Form layout='vertical'>
        <Title level={3}>{t('weapons')}</Title>
        <Row gutter={16}>
          <Col xs={24} md={10} lg={6}>
            <Form.Item label={t('name')}>
              <Input value={weaponInfo.name}
                onChange={(e) => setWeaponInfo({ ...weaponInfo, name: e.target.value })}
                style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col xs={24} md={10} lg={6}>
            <Form.Item label={t('damage')}>
              <InputNumber value={weaponInfo.damage}
                onChange={(value) => setWeaponInfo({ ...weaponInfo, damage: value ?? 0 })}
                style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col xs={24} md={10} lg={6}>
            <Form.Item label={t('recoil')}>
              <InputNumber value={weaponInfo.recoil}
                onChange={(value) => setWeaponInfo({ ...weaponInfo, recoil: value ?? 0 })}
                style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col xs={24} md={10} lg={6}>
            <Form.Item label={t('ammo')}>
              <Input value={weaponInfo.ammoItemTemplateName}
                onChange={(e) => setWeaponInfo({ ...weaponInfo, ammoItemTemplateName: e.target.value })}
                style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16} style={{ marginTop: '-20px' }}>
          <Col span={24}>
            <Checkbox checked={weaponInfo.attachToBody} onChange={(e) => setWeaponInfo({ ...weaponInfo, attachToBody: e.target.checked })}>{t('attachToBody')}</Checkbox>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={20}>
            <Form.Item label={t('components')}>
              <Select mode='tags' value={weaponInfo.components.map(x => x.itemTemplateName)}
                onChange={(value) => setWeaponInfo({ ...weaponInfo, components: value.map(x => ({ itemTemplateName: x })) })}
                style={inputStyle} />
            </Form.Item>
          </Col>
          <Col xs={24} md={10} lg={4}>
            <Form.Item label={' '}>
              <Button style={{ width: '100%' }} onClick={addWeaponInfo}>{t('add')}</Button>
            </Form.Item>
          </Col>
        </Row>
        <Table
          columns={columnsWeaponRecoils}
          dataSource={weaponsInfos}
          pagination={false}
          loading={loading}
        />
        <Title level={3}>{t('bodyParts')}</Title>
        <Row gutter={16}>
          <Col span={11}>
            <Form.Item label={t('name')}>
              <Input value={bodyPartDamage.name}
                onChange={(e) => setBodyPartDamage({ ...bodyPartDamage, name: e.target.value })}
                style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item label={t('damageMultiplier')}>
              <InputNumber value={bodyPartDamage.damageMultiplier}
                onChange={(value) => setBodyPartDamage({ ...bodyPartDamage, damageMultiplier: value ?? 0 })}
                style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col xs={24} md={10} lg={6}>
            <Form.Item label={' '}>
              <Button style={{ width: '100%' }} onClick={editBodyPartDamage}>{t('save')}</Button>
            </Form.Item>
          </Col>
        </Row>
        <Table
          columns={columnsBodyPartsDamages}
          dataSource={bodyPartsDamages}
          pagination={false}
          loading={loading}
        />
      </Form>,
    },
    {
      key: t('weaponLicense'),
      label: t('weaponLicense'),
      children:
        <Form layout='vertical'>
          <Row gutter={16}>
            <Col xs={24} md={10} lg={4}>
              <Form.Item label={t('weaponLicenseMonths')}>
                <InputNumber value={parameter.weaponLicenseMonths} onChange={(value) => setParameter({ ...parameter, weaponLicenseMonths: value ?? 0 })} style={inputStyle} />
              </Form.Item>
            </Col>
            <Col xs={24} md={10} lg={5}>
              <Form.Item label={t('weaponLicenseMaxWeapon')}>
                <InputNumber value={parameter.weaponLicenseMaxWeapon} onChange={(value) => setParameter({ ...parameter, weaponLicenseMaxWeapon: value ?? 0 })} style={inputStyle} />
              </Form.Item>
            </Col>
            <Col xs={24} md={10} lg={5}>
              <Form.Item label={t('weaponLicenseMaxAmmo')}>
                <InputNumber value={parameter.weaponLicenseMaxAmmo} onChange={(value) => setParameter({ ...parameter, weaponLicenseMaxAmmo: value ?? 0 })} style={inputStyle} />
              </Form.Item>
            </Col>
            <Col xs={24} md={10} lg={5}>
              <Form.Item label={t('weaponLicenseMaxAttachment')}>
                <InputNumber value={parameter.weaponLicenseMaxAttachment} onChange={(value) => setParameter({ ...parameter, weaponLicenseMaxAttachment: value ?? 0 })} style={inputStyle} />
              </Form.Item>
            </Col>
            <Col xs={24} md={10} lg={5}>
              <Form.Item label={t('weaponLicensePurchaseDaysInterval')}>
                <InputNumber value={parameter.weaponLicensePurchaseDaysInterval} onChange={(value) => setParameter({ ...parameter, weaponLicensePurchaseDaysInterval: value ?? 0 })} style={inputStyle} />
              </Form.Item>
            </Col>
          </Row>
        </Form>,
    },
    {
      key: t('premium'),
      label: t('premium'),
      children: <Form layout='vertical'>
        <Title level={3}>{t('items')}</Title>
        <Row gutter={16}>
          <Col span={11}>
            <Form.Item label={t('name')}>
              <Input value={premiumItem.name}
                disabled
                style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item label={t('value')}>
              <InputNumber value={premiumItem.value}
                onChange={(value) => setPremiumItem({ ...premiumItem, value: value ?? 0 })}
                disabled={!premiumItem.name}
                style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col xs={24} md={10} lg={2}>
            <Form.Item label={' '}>
              <Button style={{ width: '100%' }} disabled={!premiumItem.name} onClick={editPremiumItem}>{t('save')}</Button>
            </Form.Item>
          </Col>
        </Row>
        <Table
          columns={columnsPremiumItems}
          dataSource={premiumItems}
          pagination={false}
          loading={loading}
        />
        <Title level={3}>{t('packages')}</Title>
        <Row gutter={16}>
          <Col span={10}>
            <Form.Item label={t('name')}>
              <Input value={premiumPointPackage.name}
                onChange={(e) => setPremiumPointPackage({ ...premiumPointPackage, name: e.target.value })}
                style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item label={t('quantity')}>
              <InputNumber value={premiumPointPackage.quantity}
                onChange={(value) => setPremiumPointPackage({ ...premiumPointPackage, quantity: value ?? 0 })}
                style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item label={t('originalValue')}>
              <InputNumber value={premiumPointPackage.originalValue}
                onChange={(value) => setPremiumPointPackage({ ...premiumPointPackage, originalValue: value ?? 0 })}
                style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item label={t('value')}>
              <InputNumber value={premiumPointPackage.value}
                onChange={(value) => setPremiumPointPackage({ ...premiumPointPackage, value: value ?? 0 })}
                style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col xs={24} md={10} lg={2}>
            <Form.Item label={' '}>
              <Button style={{ width: '100%' }} onClick={editPremiumPointPackage}>{t('save')}</Button>
            </Form.Item>
          </Col>
        </Row>
        <Table
          columns={columnsPremiumPointPackages}
          dataSource={premiumPointPackages}
          pagination={false}
          loading={loading}
        />
      </Form>
    },
    {
      key: t('radioStations'),
      label: t('radioStations'),
      children: <Form layout='vertical'>
        <Title level={3}>{t('radioStations')}</Title>
        <Row gutter={16}>
          <Col span={11}>
            <Form.Item label={t('name')}>
              <Input value={audioRadioStation.name}
                onChange={(e) => setAudioRadioStation({ ...audioRadioStation, name: e.target.value })}
                style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item label={t('url')}>
              <Input value={audioRadioStation.url}
                onChange={(e) => setAudioRadioStation({ ...audioRadioStation, url: e.target.value })}
                style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col xs={24} md={10} lg={2}>
            <Form.Item label={' '}>
              <Button style={{ width: '100%' }} onClick={editAudioRationStation}>{t('save')}</Button>
            </Form.Item>
          </Col>
        </Row>
        <Table
          columns={columnsAudioRadioStations}
          dataSource={audioRadioStations}
          pagination={false}
          loading={loading}
        />
      </Form>
    },
  ];

  return <LayoutPage title={t('parameters')}>
    <>
      <Tabs defaultActiveKey="1" items={items} tabBarExtraContent={{ right: <Button loading={loading} type='primary' onClick={handleOk}>{t('save')}</Button> }} />
    </>
  </LayoutPage>
};

export default ParametersPage;