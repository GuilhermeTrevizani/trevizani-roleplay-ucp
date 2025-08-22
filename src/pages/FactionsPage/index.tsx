import { t } from 'i18next';
import LayoutPage from '../LayoutPage';
import Table, { type ColumnsType } from 'antd/es/table';
import { useEffect, useState } from 'react';
import { formatDateTime, formatValue, removeAccents } from '../../services/format';
import { useApi } from '../../hooks/useApi';
import { useNotification } from '../../hooks/useNotification';
import { Badge, Button, Checkbox, Col, Flex, Form, Input, InputNumber, Modal, Popconfirm, Row, Select, Tabs, Tag, type TabsProps } from 'antd';
import type FactionResponse from '../../types/FactionResponse';
import type SelectOptionResponse from '../../types/SelectOptionResponse';
import type FactionRank from '../../types/FactionRank';
import type FactionMemberResponse from '../../types/FactionMemberResponse';
import type FactionVehicle from '../../types/FactionVehicle';
import type FactionFrequencyResponse from '../../types/FactionFrequencyResponse';
import type FactionEquipmentResponse from '../../types/FactionEquipmentResponse';
import type FactionFrequencyRequest from '../../types/FactionFrequencyRequest';
import type FactionEquipmentRequest from '../../types/FactionEquipmentRequest';
import type FactionVehicleRequest from '../../types/FactionVehicleRequest';
import type FactionEquipmentItemResponse from '../../types/FactionEquipmentItemResponse';
import type FactionEquipmentItemRequest from '../../types/FactionEquipmentItemRequest';

const FactionsPage = () => {
  const api = useApi();
  const [loading, setLoading] = useState(false);
  const notification = useNotification();
  const [originalItems, setOriginalItems] = useState<FactionResponse[]>([]);
  const [items, setItems] = useState<FactionResponse[]>([]);
  const [search, setSearch] = useState('');
  const [record, setRecord] = useState<FactionResponse>({
    name: '',
    shortName: '',
    slots: 0,
    type: 0,
    typeDisplay: '',
  });
  const [types, setTypes] = useState<SelectOptionResponse[]>([]);
  const [recordModal, setRecordModal] = useState(false);
  const [searchMember, setSearchMember] = useState('');
  const [searchRank, setSearchRank] = useState('');
  const [searchEquipment, setSearchEquipment] = useState('');
  const [searchVehicle, setSearchVehicle] = useState('');
  const [searchFrequency, setSearchFrequency] = useState('');
  const [searchEquipmentItem, setSearchEquipmentItem] = useState('');
  const [ranks, setRanks] = useState<FactionRank[]>([]);
  const [originalRanks, setOriginalRanks] = useState<FactionRank[]>([]);
  const [members, setMembers] = useState<FactionMemberResponse[]>([]);
  const [originalMembers, setOriginalMembers] = useState<FactionMemberResponse[]>([]);
  const [vehicles, setVehicles] = useState<FactionVehicle[]>([]);
  const [originalVehicles, setOriginalVehicles] = useState<FactionVehicle[]>([]);
  const [equipments, setEquipments] = useState<FactionEquipmentResponse[]>([]);
  const [originalEquipments, setOriginalEquipments] = useState<FactionEquipmentResponse[]>([]);
  const [frequencies, setFrequencies] = useState<FactionFrequencyResponse[]>([]);
  const [originalFrequencies, setOriginalFrequencies] = useState<FactionFrequencyResponse[]>([]);
  const [rank, setRank] = useState<FactionRank>();
  const [vehicle, setVehicle] = useState<FactionVehicleRequest>();
  const [frequency, setFrequency] = useState<FactionFrequencyRequest>();
  const [equipment, setEquipment] = useState<FactionEquipmentRequest>();
  const [vehicleModels, setVehicleModels] = useState<string[]>([]);
  const [equipmentItemsModal, setEquipmentItemsModal] = useState(false);
  const [equipmentItems, setEquipmentItems] = useState<FactionEquipmentItemResponse[]>([]);
  const [originalEquipmentItems, setOriginalEquipmentItems] = useState<FactionEquipmentItemResponse[]>([]);
  const [equipmentItem, setEquipmentItem] = useState<FactionEquipmentItemRequest>();
  const [equipmentItemEquipmentId, setEquipmentItemEquipmentId] = useState('');

  useEffect(() => {
    getAll();
  }, []);

  const getAll = async () => {
    setLoading(true);
    await Promise.all([getTypes(), getFactions(), getVehicleModels()]);
    setLoading(false);
  }

  const getFactions = async () => {
    await api.getFactions()
      .then(res => {
        setOriginalItems(res);
      })
      .catch(res => {
        notification.alert('error', res);
      });
  };

  const getTypes = async () => {
    await api.getFactionTypes()
      .then(res => {
        setTypes(res);
      })
      .catch(res => {
        notification.alert('error', res);
      });
  };

  const getVehicleModels = async () => {
    await api.getVehicleModels()
      .then(res => {
        setVehicleModels(res);
      })
      .catch(res => {
        notification.alert('error', res);
      });
  };

  const getMembers = async (id: string) => {
    await api.getFactionMembers(id)
      .then(res => {
        setOriginalMembers(res);
      })
      .catch(res => {
        notification.alert('error', res);
      });
  };

  const getRanks = async (id: string) => {
    await api.getFactionRanks(id)
      .then(res => {
        setOriginalRanks(res);
      })
      .catch(res => {
        notification.alert('error', res);
      });
  };

  const getVehicles = async (id: string) => {
    await api.getFactionVehicles(id)
      .then(res => {
        setOriginalVehicles(res);
      })
      .catch(res => {
        notification.alert('error', res);
      });
  };

  const getFrequencies = async (id: string) => {
    await api.getFactionFrequencies(id)
      .then(res => {
        setOriginalFrequencies(res);
      })
      .catch(res => {
        notification.alert('error', res);
      });
  };

  const getEquipments = async (id: string) => {
    await api.getFactionEquipments(id)
      .then(res => {
        setOriginalEquipments(res);
      })
      .catch(res => {
        notification.alert('error', res);
      });
  };

  const getEquipmentItems = async (id: string) => {
    await api.getFactionEquipmentItems(id)
      .then(res => {
        setOriginalEquipmentItems(res);
      })
      .catch(res => {
        notification.alert('error', res);
      });
  };

  const add = () => {
    setRecord({
      name: '',
      shortName: '',
      slots: 0,
      type: 7,
      typeDisplay: '',
    });
    setRecordModal(true);
  };

  const edit = async (record: FactionResponse) => {
    setLoading(true);
    setRecord(record);
    setRecordModal(true);
    await Promise.all([getMembers(record.id!), getRanks(record.id!), getVehicles(record.id!), getEquipments(record.id!), getFrequencies(record.id!)]);
    setLoading(false);
  }

  const handleModalCancel = () => {
    setRecordModal(false);
    setRecord({
      name: '',
      shortName: '',
      slots: 0,
      type: 0,
      typeDisplay: '',
    });
  }

  const saveFaction = () => {
    setLoading(true);
    api.staffSaveFaction(record!)
      .then(async () => {
        await getFactions();
        notification.alert('success', t('recordSaved'));
      })
      .catch(res => {
        notification.alert('error', res);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const editRank = (rank: FactionRank) => {
    setRank(rank);
  }

  const handleModalRankOk = () => {
    setLoading(true);
    api.staffSaveFactionRank(rank!)
      .then(async () => {
        notification.alert('success', t('recordSaved'));
        await getRanks(record.id!);
      })
      .catch(res => {
        notification.alert('error', res);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  const handleModalRankCancel = () => {
    setRank(undefined);
  }

  useEffect(() => {
    if (searchRank == '') {
      setRanks(originalRanks);
      return;
    }

    const newSearch = removeAccents(searchRank);
    const filteredItems = originalRanks.filter(x =>
      removeAccents(x.name).includes(newSearch)
    );
    setRanks(filteredItems);
  }, [searchRank, originalRanks]);

  useEffect(() => {
    if (search == '') {
      setItems(originalItems);
      return;
    }

    const newSearch = removeAccents(search);
    const filteredItems = originalItems.filter(x =>
      removeAccents(x.name).includes(newSearch) || removeAccents(x.typeDisplay).includes(newSearch)
      || removeAccents(x.shortName).includes(newSearch) || removeAccents(x.leader).includes(newSearch)
    );
    setItems(filteredItems);
  }, [search, originalItems]);

  const columns: ColumnsType<FactionResponse> = [
    {
      title: t('name'),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: t('shortName'),
      dataIndex: 'shortName',
      key: 'shortName',
    },
    {
      title: t('type'),
      dataIndex: 'typeDisplay',
      key: 'typeDisplay',
    },
    {
      title: t('slots'),
      dataIndex: 'slots',
      key: 'slots',
    },
    {
      title: t('leader'),
      dataIndex: 'leader',
      key: 'leader',
    },
    {
      title: t('options'),
      dataIndex: 'id',
      key: 'options',
      align: 'center',
      render: (_, record: FactionResponse) => <Flex justify='space-evenly'>
        <Button size='small' onClick={() => edit(record)}>{t('edit')}</Button>
      </Flex>,
    },
  ];

  const columnsRanks: ColumnsType<FactionRank> = [
    {
      title: t('name'),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: t('salary'),
      dataIndex: 'salary',
      key: 'salary',
      render: (salary: number) => `$${formatValue(salary)}`,
    },
    {
      title: t('options'),
      dataIndex: 'id',
      key: 'options',
      align: 'center',
      render: (_, record: FactionRank) => <Flex justify='space-evenly'>
        <Button size='small' onClick={() => editRank(record)}>{t('edit')}</Button>
      </Flex>,
    },
  ];

  useEffect(() => {
    if (searchMember == '') {
      setMembers(originalMembers);
      return;
    }

    const newSearch = removeAccents(searchMember);
    const filteredItems = originalMembers.filter(x =>
      removeAccents(x.name).includes(newSearch) || removeAccents(x.user).includes(newSearch) || removeAccents(x.rankName).includes(newSearch)
    );
    setMembers(filteredItems);
  }, [searchMember, originalMembers]);

  const columnsMembers: ColumnsType<FactionMemberResponse> = [
    {
      title: t('rank'),
      dataIndex: 'rankName',
      key: 'rankName',
    },
    {
      title: t('name'),
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: FactionMemberResponse) =>
        <>{name} <Tag color={record.isOnline ? 'green' : 'red'}>{record.isOnline ? 'online' : 'offline'}</Tag></>,
    },
    {
      title: t('user'),
      dataIndex: 'user',
      key: 'user',
    },
    {
      title: t('lastAccess'),
      dataIndex: 'lastAccessDate',
      key: 'lastAccessDate',
      render: (lastAccessDate: Date) => formatDateTime(lastAccessDate),
    },
  ];

  useEffect(() => {
    if (searchVehicle == '') {
      setVehicles(originalVehicles);
      return;
    }

    const newSearch = removeAccents(searchVehicle);
    const filteredItems = originalVehicles.filter(x =>
      removeAccents(x.model).includes(newSearch) || removeAccents(x.plate).includes(newSearch) || removeAccents(x.description).includes(newSearch)
    );
    setVehicles(filteredItems);
  }, [searchVehicle, originalVehicles]);

  const columnsVehicles: ColumnsType<FactionVehicle> = [
    {
      title: t('model'),
      dataIndex: 'model',
      key: 'model',
    },
    {
      title: t('plate'),
      dataIndex: 'plate',
      key: 'plate',
    },
    {
      title: t('description'),
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: t('options'),
      dataIndex: 'id',
      key: 'options',
      align: 'center',
      render: (id: string) => <Flex justify='space-evenly'>
        <Popconfirm
          title={t('deleteRecord')}
          description={t('deleteRecordConfirm')}
          onConfirm={() => removeVehicle(id)}
          okText={t('yes')}
          cancelText={t('no')}
        >
          <Button danger size='small'>{t('delete')}</Button>
        </Popconfirm>
      </Flex>,
    },
  ];

  const removeVehicle = (id: string) => {
    setLoading(true);
    api.staffRemoveFactionVehicle(id)
      .then(async () => {
        notification.alert('success', t('recordRemoved'));
        await getVehicles(record.id!);
      })
      .catch(res => {
        notification.alert('error', res);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  useEffect(() => {
    if (searchEquipment == '') {
      setEquipments(originalEquipments);
      return;
    }

    const newSearch = removeAccents(searchEquipment);
    const filteredItems = originalEquipments.filter(x =>
      removeAccents(x.name).includes(newSearch)
    );
    setEquipments(filteredItems);
  }, [searchEquipment, originalEquipments]);

  const columnsEquipments: ColumnsType<FactionEquipmentResponse> = [
    {
      title: t('name'),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: t('propertyOrVehicle'),
      dataIndex: 'propertyOrVehicle',
      key: 'propertyOrVehicle',
      render: (propertyOrVehicle: boolean) => t(propertyOrVehicle ? 'yes' : 'no'),
    },
    {
      title: t('swat'),
      dataIndex: 'swat',
      key: 'swat',
      render: (swat: boolean) => t(swat ? 'yes' : 'no'),
    },
    {
      title: t('upr'),
      dataIndex: 'upr',
      key: 'upr',
      render: (upr: boolean) => t(upr ? 'yes' : 'no'),
    },
    {
      title: t('options'),
      dataIndex: 'id',
      key: 'options',
      align: 'center',
      render: (id: string, record: FactionEquipmentResponse) => <Flex justify='space-evenly'>
        <Button size='small' onClick={() => editEquipment(record)}>{t('edit')}</Button>
        <Button size='small' onClick={() => showItemsEquipment(record.id)}>{t('items')}</Button>
        <Popconfirm
          title={t('deleteRecord')}
          description={t('deleteRecordConfirm')}
          onConfirm={() => removeEquipment(id)}
          okText={t('yes')}
          cancelText={t('no')}
        >
          <Button danger size='small'>{t('delete')}</Button>
        </Popconfirm>
      </Flex>,
    },
  ];

  const editEquipment = (equipment: FactionEquipmentResponse) => {
    setEquipment({
      factionId: record.id!,
      name: equipment.name,
      propertyOrVehicle: equipment.propertyOrVehicle,
      swat: equipment.swat,
      upr: equipment.upr,
      id: equipment.id,
    });
  }

  const addEquipment = () => {
    setEquipment({
      factionId: record.id!,
      name: '',
      propertyOrVehicle: false,
      swat: false,
      upr: false
    });
  }

  const handleModalEquipmentOk = () => {
    setLoading(true);
    api.staffSaveFactionEquipment(equipment!)
      .then(async () => {
        notification.alert('success', t('recordSaved'));
        await getEquipments(record.id!);
        handleModalEquipmentCancel();
      })
      .catch(res => {
        notification.alert('error', res);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  const handleModalEquipmentCancel = () => {
    setEquipment(undefined);
  }

  const removeEquipment = (id: string) => {
    setLoading(true);
    api.staffRemoveFactionEquipment(id)
      .then(async () => {
        notification.alert('success', t('recordRemoved'));
        await getEquipments(record.id!);
      })
      .catch(res => {
        notification.alert('error', res);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  useEffect(() => {
    if (searchFrequency == '') {
      setFrequencies(originalFrequencies);
      return;
    }

    const newSearch = removeAccents(searchFrequency);
    const filteredItems = originalFrequencies.filter(x =>
      removeAccents(x.name).includes(newSearch) || x.frequency.toString().includes(newSearch)
    );
    setFrequencies(filteredItems);
  }, [searchFrequency, originalFrequencies]);

  const columnsFrequencies: ColumnsType<FactionFrequencyResponse> = [
    {
      title: t('frequency'),
      dataIndex: 'frequency',
      key: 'frequency',
    },
    {
      title: t('name'),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: t('options'),
      dataIndex: 'id',
      key: 'options',
      align: 'center',
      render: (id: string, record: FactionFrequencyResponse) => <Flex justify='space-evenly'>
        <Button size='small' onClick={() => editFrequency(record)}>{t('edit')}</Button>
        <Popconfirm
          title={t('deleteRecord')}
          description={t('deleteRecordConfirm')}
          onConfirm={() => removeFrequency(id)}
          okText={t('yes')}
          cancelText={t('no')}
        >
          <Button danger size='small'>{t('delete')}</Button>
        </Popconfirm>
      </Flex>,
    },
  ];

  const editFrequency = (frequency: FactionFrequencyResponse) => {
    setFrequency({
      factionId: record.id!,
      frequency: frequency.frequency,
      name: frequency.name,
      id: frequency.id
    });
  }

  const handleModalFrequencyOk = () => {
    setLoading(true);
    api.staffSaveFactionFrequency(frequency!)
      .then(async () => {
        notification.alert('success', t('recordSaved'));
        await getFrequencies(record.id!);
        handleModalFrequencyCancel();
      })
      .catch(res => {
        notification.alert('error', res);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  const handleModalFrequencyCancel = () => {
    setFrequency(undefined);
  }

  const removeFrequency = (id: string) => {
    setLoading(true);
    api.staffRemoveFactionFrequency(id)
      .then(async () => {
        notification.alert('success', t('recordRemoved'));
        await getFrequencies(record.id!);
      })
      .catch(res => {
        notification.alert('error', res);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  const addVehicle = () => {
    setVehicle({
      factionId: record.id!,
      model: ''
    });
  }

  const handleModalVehicleOk = () => {
    setLoading(true);
    api.staffSaveFactionVehicle(vehicle!)
      .then(async () => {
        notification.alert('success', t('recordSaved'));
        await getVehicles(record.id!);
        handleModalVehicleCancel();
      })
      .catch(res => {
        notification.alert('error', res);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  const handleModalVehicleCancel = () => {
    setVehicle(undefined);
  }

  const addFrequency = () => {
    setFrequency({
      factionId: record.id!,
      frequency: 0,
      name: ''
    });
  }

  const showItemsEquipment = async (id: string) => {
    setEquipmentItemsModal(true);
    setEquipmentItemEquipmentId(id);
    setLoading(true);
    await getEquipmentItems(id);
    setLoading(false);
  }

  const addEquipmentItem = () => {
    setEquipmentItem({
      factionEquipmentId: equipmentItemEquipmentId,
      weapon: '',
      ammo: 1,
      components: []
    });
  }

  const editEquipmentItem = (record: FactionEquipmentItemResponse) => {
    setEquipmentItem({
      factionEquipmentId: equipmentItemEquipmentId,
      weapon: record.weapon,
      ammo: record.ammo,
      id: record.id,
      components: record.components
    });
  }

  const handleModalEquipmentItemsCancel = () => {
    setOriginalEquipmentItems([]);
    setEquipmentItemsModal(false);
  }

  const removeEquipmentItem = (id: string) => {
    setLoading(true);
    api.staffRemoveFactionEquipmentItem(id)
      .then(async () => {
        notification.alert('success', t('recordRemoved'));
        await getEquipmentItems(equipmentItemEquipmentId);
      })
      .catch(res => {
        notification.alert('error', res);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  const handleModalEquipmentItemOk = () => {
    setLoading(true);
    api.staffSaveFactionEquipmentItem(equipmentItem!)
      .then(async () => {
        notification.alert('success', t('recordSaved'));
        await getEquipmentItems(equipmentItemEquipmentId);
        handleModalEquipmentItemCancel();
      })
      .catch(res => {
        notification.alert('error', res);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  const handleModalEquipmentItemCancel = () => {
    setEquipmentItem(undefined);
  }

  useEffect(() => {
    if (searchEquipmentItem == '') {
      setEquipmentItems(originalEquipmentItems);
      return;
    }

    const newSearch = removeAccents(searchEquipmentItem);
    const filteredItems = originalEquipmentItems.filter(x =>
      removeAccents(x.weapon).includes(newSearch)
    );
    setEquipmentItems(filteredItems);
  }, [searchEquipmentItem, originalEquipmentItems]);

  const columnsEquipmentItems: ColumnsType<FactionEquipmentItemResponse> = [
    {
      title: t('weapon'),
      dataIndex: 'weapon',
      key: 'weapon',
    },
    {
      title: t('ammo'),
      dataIndex: 'ammo',
      key: 'ammo',
      render: (ammo: number) => formatValue(ammo),
    },
    {
      title: t('options'),
      dataIndex: 'id',
      key: 'options',
      align: 'center',
      render: (id: string, record: FactionEquipmentItemResponse) => <Flex justify='space-evenly'>
        <Button size='small' onClick={() => editEquipmentItem(record)}>{t('edit')}</Button>
        <Popconfirm
          title={t('deleteRecord')}
          description={t('deleteRecordConfirm')}
          onConfirm={() => removeEquipmentItem(id)}
          okText={t('yes')}
          cancelText={t('no')}
        >
          <Button danger size='small'>{t('delete')}</Button>
        </Popconfirm>
      </Flex>,
    },
  ];

  const tabItems: TabsProps['items'] = [
    {
      key: t('faction'),
      label: t('faction'),
      children: <>
        <Form layout='vertical'>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item label={t('name')}>
                <Input value={record.name} onChange={(e) => setRecord({ ...record, name: e.target.value })} style={{ width: '100%' }} maxLength={50} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item label={t('shortName')}>
                <Input value={record.shortName} onChange={(e) => setRecord({ ...record, shortName: e.target.value })} style={{ width: '100%' }} maxLength={10} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item label={t('type')}>
                <Select value={record.type} options={types} onChange={(value) => setRecord({ ...record, type: value })} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item label={t('slots')}>
                <InputNumber value={record.slots} onChange={(value) => setRecord({ ...record, slots: value! })} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item label={t('leader')}>
                <Input value={record.leader} onChange={(e) => setRecord({ ...record, leader: e.target.value })} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <Row gutter={16}>
          <Col span={24}>
            <Button loading={loading} onClick={saveFaction}>{t('save')}</Button>
          </Col>
        </Row>
      </>,
    },
    {
      key: t('members'),
      label: <>{t('members')} <Badge color='blue' count={originalMembers.length} showZero /></>,
      disabled: !record.id,
      children: <>
        <Row gutter={16}>
          <Col span={24}>
            <Input placeholder={t('searchHere')} value={searchMember} onChange={(e) => setSearchMember(e.target.value)} />
          </Col>
        </Row>
        <Table
          columns={columnsMembers}
          dataSource={members}
          loading={loading}
          style={{ marginTop: '10px' }}
          locale={{ emptyText: t('factionHasNoMembers') }}
        />
      </>,
    },
    {
      key: t('ranks'),
      label: <>{t('ranks')} <Badge color='blue' count={originalRanks.length} showZero /></>,
      disabled: !record.id,
      children: <>
        <Row gutter={16}>
          <Col span={24}>
            <Input placeholder={t('searchHere')} value={searchRank} onChange={(e) => setSearchRank(e.target.value)} />
          </Col>
        </Row>
        <Table
          columns={columnsRanks}
          dataSource={ranks}
          loading={loading}
          style={{ marginTop: '10px' }}
        />
      </>,
    },
    {
      key: t('vehicles'),
      label: <>{t('vehicles')} <Badge color='blue' count={originalVehicles.length} showZero /></>,
      disabled: !record.id,
      children: <>
        <Row gutter={16}>
          <Col span={20}>
            <Input placeholder={t('searchHere')} value={searchVehicle} onChange={(e) => setSearchVehicle(e.target.value)} />
          </Col>
          <Col span={4}>
            <Button style={{ width: '100%' }} onClick={addVehicle}>{t('add')}</Button>
          </Col>
        </Row>
        <Table
          columns={columnsVehicles}
          dataSource={vehicles}
          loading={loading}
          style={{ marginTop: '10px' }}
          locale={{ emptyText: t('factionHasNoVehicles') }}
        />
      </>,
    },
    {
      key: t('frequencies'),
      label: <>{t('frequencies')} <Badge color='blue' count={originalFrequencies.length} showZero /></>,
      disabled: !record.id,
      children: <>
        <Row gutter={16}>
          <Col span={20}>
            <Input placeholder={t('searchHere')} value={searchFrequency} onChange={(e) => setSearchFrequency(e.target.value)} />
          </Col>
          <Col span={4}>
            <Button style={{ width: '100%' }} onClick={addFrequency}>{t('add')}</Button>
          </Col>
        </Row>
        <Table
          columns={columnsFrequencies}
          dataSource={frequencies}
          loading={loading}
          style={{ marginTop: '10px' }}
          locale={{ emptyText: t('factionHasNoFrequencies') }}
        />
      </>,
    },
    {
      key: t('equipments'),
      label: <>{t('equipments')} <Badge color='blue' count={originalEquipments.length} showZero /></>,
      disabled: !record.id,
      children: <>
        <Row gutter={16}>
          <Col span={20}>
            <Input placeholder={t('searchHere')} value={searchEquipment} onChange={(e) => setSearchEquipment(e.target.value)} />
          </Col>
          <Col span={4}>
            <Button style={{ width: '100%' }} onClick={addEquipment}>{t('add')}</Button>
          </Col>
        </Row>
        <Table
          columns={columnsEquipments}
          dataSource={equipments}
          loading={loading}
          style={{ marginTop: '10px' }}
          locale={{ emptyText: t('factionHasNoEquipments') }}
        />
      </>,
    },
  ];

  return (
    <LayoutPage title={t('factions')}>
      <>
        <Row gutter={16}>
          <Col span={20}>
            <Input placeholder={t('searchHere')} value={search} onChange={(e) => setSearch(e.target.value)} />
          </Col>
          <Col span={4}>
            <Button style={{ width: '100%' }} onClick={add}>{t('add')}</Button>
          </Col>
        </Row>
        <Table
          columns={columns}
          dataSource={items}
          loading={loading}
          style={{ marginTop: '10px' }}
        />

        {recordModal && <Modal open={true} title={(record.id ? t('edit') : t('add')) + ' ' + t('faction')}
          onCancel={handleModalCancel} confirmLoading={loading} footer={null} width={'90%'}>
          <Tabs defaultActiveKey="1" items={tabItems} />
        </Modal>}

        {rank && <Modal open={true} title={t('edit') + ' ' + t('rank')} onOk={handleModalRankOk} onCancel={handleModalRankCancel}
          confirmLoading={loading} cancelText={t('close')} okText={t('save')} >
          <Form layout='vertical'>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item label={t('name')}>
                  <Input value={rank.name} style={{ width: '100%' }} readOnly />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item label={t('salary')}>
                  <InputNumber value={rank.salary} onChange={(value) => setRank({ ...rank, salary: value! })} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>}

        {vehicle && <Modal open={true} title={t('add') + ' ' + t('vehicle')}
          onOk={handleModalVehicleOk} onCancel={handleModalVehicleCancel} confirmLoading={loading}
          cancelText={t('close')} okText={t('save')} >
          <Form layout='vertical'>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item label={t('serverMods')}>
                  {vehicleModels.map(x => <Tag>{x}</Tag>)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item label={t('model')}>
                  <Input value={vehicle.model} onChange={(e) => setVehicle({ ...vehicle, model: e.target.value })} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>}

        {frequency && <Modal open={true} title={(frequency.id ? t('edit') : t('add')) + ' ' + t('frequency')} onOk={handleModalFrequencyOk} onCancel={handleModalFrequencyCancel} confirmLoading={loading}
          cancelText={t('close')} okText={t('save')} >
          <Form layout='vertical'>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item label={t('frequency')}>
                  <InputNumber value={frequency.frequency} onChange={(value) => setFrequency({ ...frequency, frequency: value! })} style={{ width: '100%' }} min={0} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item label={t('name')}>
                  <Input value={frequency.name} onChange={(e) => setFrequency({ ...frequency, name: e.target.value })} maxLength={10} />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>}

        {equipment && <Modal open={true} title={(equipment.id ? t('edit') : t('add')) + ' ' + t('equipment')}
          onOk={handleModalEquipmentOk} onCancel={handleModalEquipmentCancel} confirmLoading={loading}
          cancelText={t('close')} okText={t('save')} >
          <Form layout='vertical'>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item label={t('name')}>
                  <Input value={equipment.name} onChange={(e) => setEquipment({ ...equipment, name: e.target.value })} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Checkbox checked={equipment.propertyOrVehicle} onChange={(e) => setEquipment({ ...equipment, propertyOrVehicle: e.target.checked })}>{t('propertyOrVehicle')}</Checkbox>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Checkbox checked={equipment.swat} onChange={(e) => setEquipment({ ...equipment, swat: e.target.checked })}>{t('swat')}</Checkbox>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Checkbox checked={equipment.upr} onChange={(e) => setEquipment({ ...equipment, upr: e.target.checked })}>{t('upr')}</Checkbox>
              </Col>
            </Row>
          </Form>
        </Modal>}

        {equipmentItemsModal && <Modal open={true} title={t('items')} onCancel={handleModalEquipmentItemsCancel} footer={null} width={'60%'}>
          <Row gutter={16}>
            <Col span={20}>
              <Input placeholder={t('searchHere')} value={searchEquipmentItem} onChange={(e) => setSearchEquipmentItem(e.target.value)} />
            </Col>
            <Col span={4}>
              <Button style={{ width: '100%' }} onClick={addEquipmentItem} loading={loading}>{t('add')}</Button>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Table
                columns={columnsEquipmentItems}
                dataSource={equipmentItems}
                loading={loading}
                locale={{ emptyText: t('equipmentHasNoItems') }}
                style={{ marginTop: '10px' }}
              />
            </Col>
          </Row>
        </Modal>}

        {equipmentItem && <Modal open={true} title={(equipmentItem.id ? t('edit') : t('add')) + ' ' + t('item')} onOk={handleModalEquipmentItemOk} onCancel={handleModalEquipmentItemCancel}
          confirmLoading={loading} cancelText={t('close')} okText={t('save')} >
          <Form layout='vertical'>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item label={t('weapon')}>
                  <Input value={equipmentItem.weapon}
                    onChange={(e) => setEquipmentItem({ ...equipmentItem, weapon: e.target.value })} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item label={t('ammo')}>
                  <InputNumber value={equipmentItem.ammo} onChange={(value) => setEquipmentItem({ ...equipmentItem, ammo: value! })} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item label={t('components')}>
                  <Select mode='tags' value={equipmentItem.components} onChange={(value) => setEquipmentItem({ ...equipmentItem, components: value })} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>}
      </>
    </LayoutPage>
  );
};

export default FactionsPage;