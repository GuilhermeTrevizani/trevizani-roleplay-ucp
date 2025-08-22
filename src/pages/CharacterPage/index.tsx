import { t } from 'i18next';
import LayoutPage from '../LayoutPage';
import { useEffect, useState } from 'react';
import { useApi } from '../../hooks/useApi';
import { useNotification } from '../../hooks/useNotification';
import { Button, Card, Col, Descriptions, Flex, Form, Input, Modal, Popconfirm, Row, Select, Space, Table, type DescriptionsProps } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import type CharacterResponse from '../../types/CharacterResponse';
import { formatDateTime, formatValue, removeAccents } from '../../services/format';
import type { ColumnsType } from 'antd/es/table';
import type { CharacterCompanyResponse, CharacterPropertyResponse, CharacterVehicleResponse } from '../../types/CharacterResponse';
import type CompanySafeMovementResponse from '../../types/CompanySafeMovementResponse';

const CharacterPage = () => {
  const api = useApi();
  const [loading, setLoading] = useState(false);
  const notification = useNotification();
  const { id } = useParams();
  const navigate = useNavigate();
  const [response, setResponse] = useState<CharacterResponse>();
  const [openCompanySaveMovementsModal, setOpenCompanySafeMovementsModal] = useState(false);
  const [originalCompanySafeMovements, setOriginalCompanySafeMovements] = useState<CompanySafeMovementResponse[]>([]);
  const [titleCompanySafeMovements, setTitleCompanySafeMovements] = useState('');
  const [searchCompanySafeMovements, setSearchCompanySafeMovements] = useState('');
  const [companySafeMovements, setCompanySafeMovements] = useState<CompanySafeMovementResponse[]>([]);
  const [vehicleCharactersWithAccess, setVehicleCharactersWithAccess] = useState<CharacterVehicleResponse>();
  const [propertyCharactersWithAccess, setPropertyCharactersWithAccess] = useState<CharacterPropertyResponse>();

  useEffect(() => {
    getInfo();
  }, []);

  const deleteCharacter = (id: string) => {
    setLoading(true);
    api.deleteCharacter(id)
      .then(() => {
        navigate('/my-characters');
      })
      .catch(res => {
        notification.alert('error', res);
        setLoading(false);
      })
  }

  const getInfo = () => {
    setLoading(true);
    api.getMyCharacter(id!)
      .then(res => {
        setResponse(res);
      })
      .catch(res => {
        notification.alert('error', res);
        navigate('/my-characters');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const alterCharacter = (id: string) => {
    setLoading(true);
    navigate(`/create-character/${id}`);
  }

  const accessVehicle = (vehicle: CharacterVehicleResponse) => {
    setVehicleCharactersWithAccess(vehicle);
  }

  const handleVehicleCharactersWithAccessModalCancel = () => {
    setVehicleCharactersWithAccess(undefined);
  }

  const handleVehicleCharactersWithAccessModalSave = () => {
    setLoading(true);
    api.changeVehicleAccess(vehicleCharactersWithAccess!)
      .then(() => {
        notification.alert('success', t('recordSaved'));
        setVehicleCharactersWithAccess(undefined);
        getInfo();
      })
      .catch(res => {
        notification.alert('error', res);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  const accessProperty = (property: CharacterPropertyResponse) => {
    setPropertyCharactersWithAccess(property);
  }

  const handlePropertyCharactersWithAccessModalCancel = () => {
    setPropertyCharactersWithAccess(undefined);
  }

  const handlePropertyCharactersWithAccessModalSave = () => {
    setLoading(true);
    api.changePropertyAccess(propertyCharactersWithAccess!)
      .then(() => {
        notification.alert('success', t('recordSaved'));
        setPropertyCharactersWithAccess(undefined);
        getInfo();
      })
      .catch(res => {
        notification.alert('error', res);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  const safeMovements = (company: CharacterCompanyResponse) => {
    setLoading(true);
    api.getCompanySafeMovements(company.id)
      .then(res => {
        setSearchCompanySafeMovements('');
        setTitleCompanySafeMovements(`${company.name} - ${t('safeMovements')}`);
        setOriginalCompanySafeMovements(res);
        setOpenCompanySafeMovementsModal(true);
      })
      .catch(res => {
        notification.alert('error', res);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  const handleCompanySaveMovementsModalCancel = () => {
    setOpenCompanySafeMovementsModal(false);
  }

  useEffect(() => {
    if (searchCompanySafeMovements == '') {
      setCompanySafeMovements(originalCompanySafeMovements);
      return;
    }

    const newSearch = removeAccents(searchCompanySafeMovements);
    const filteredItems = originalCompanySafeMovements.filter(x =>
      removeAccents(x.type).includes(newSearch) || removeAccents(x.description).includes(newSearch)
      || removeAccents(x.character).includes(newSearch) || formatDateTime(x.date).includes(newSearch)
    );
    setCompanySafeMovements(filteredItems);
  }, [searchCompanySafeMovements, originalCompanySafeMovements]);

  if (!response)
    return <></>

  const items: DescriptionsProps['items'] = [
    {
      key: t('age'),
      label: t('age'),
      children: `${response.age} ${t('years')}`.toLocaleLowerCase(),
    },
    {
      key: t('sex'),
      label: t('sex'),
      children: response.sexDescription,
    },
    {
      key: t('registerDate'),
      label: t('registerDate'),
      children: formatDateTime(response.registerDate),
    },
    {
      key: t('connectedTime'),
      label: t('connectedTime'),
      children: `${formatValue(response.connectedTime)} ${t('minutes')} (${formatValue(response.connectedTime / 60)} ${t('hours')})`.toLocaleLowerCase(),
    },
    {
      key: t('faction'),
      label: t('faction'),
      children: response.factionName ? `${response.factionRankName} - ${response.factionName}` : '',
    },
    {
      key: t('job'),
      label: t('job'),
      children: response.job,
    },
    {
      key: t('equippedCellphone'),
      label: t('equippedCellphone'),
      children: response.cellphone != 0 ? response.cellphone : '',
    },
    {
      key: t('bank'),
      label: t('bank'),
      children: `$${formatValue(response.bank)}`,
    },
    {
      key: t('history'),
      label: t('history'),
      span: 4,
      children: response.history,
    },
    {
      key: t('attributes'),
      label: t('attributes'),
      span: 4,
      children: response.attributes,
    },
  ];

  const columnsVehicles: ColumnsType<CharacterVehicleResponse> = [
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
      title: t('charactersWithAccess'),
      dataIndex: 'charactersWithAccess',
      key: 'charactersWithAccess',
      render: (charactersWithAcess: string[]) => charactersWithAcess.join(', '),
    },
    {
      title: t('options'),
      dataIndex: 'id',
      key: 'options',
      align: 'center',
      render: (_, record: CharacterVehicleResponse) => <Flex justify='space-evenly'>
        <Button size='small' onClick={() => accessVehicle(record)}>{t('access')}</Button>
      </Flex>,
    },
  ];

  const columnsProperties: ColumnsType<CharacterPropertyResponse> = [
    {
      title: t('number'),
      dataIndex: 'number',
      key: 'number',
    },
    {
      title: t('address'),
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: t('charactersWithAccess'),
      dataIndex: 'charactersWithAccess',
      key: 'charactersWithAccess',
      render: (charactersWithAcess: string[]) => charactersWithAcess.join(', '),
    },
    {
      title: t('options'),
      dataIndex: 'id',
      key: 'options',
      align: 'center',
      render: (_, record: CharacterPropertyResponse) => <Flex justify='space-evenly'>
        <Button size='small' onClick={() => accessProperty(record)}>{t('access')}</Button>
      </Flex>,
    },
  ];

  const columnsCompanies: ColumnsType<CharacterCompanyResponse> = [
    {
      title: t('name'),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: t('safe'),
      dataIndex: 'safe',
      key: 'safe',
      render: (safe: number, record: CharacterCompanyResponse) => record.hasSafeAccess ? `$${formatValue(safe)}` : t('noAccess'),
    },
    {
      title: t('options'),
      dataIndex: 'id',
      key: 'options',
      align: 'center',
      render: (_, record: CharacterCompanyResponse) => <Flex justify='space-evenly'>
        {record.hasSafeAccess && <Button size='small' onClick={() => safeMovements(record)}>{t('safeMovements')}</Button>}
      </Flex>,
    },
  ];

  const columnsCompanySafeMovements: ColumnsType<CompanySafeMovementResponse> = [
    {
      title: t('date'),
      dataIndex: 'date',
      key: 'date',
      render: (date: Date) => formatDateTime(date),
    },
    {
      title: t('type'),
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: t('value'),
      dataIndex: 'value',
      key: 'value',
      render: (value: number) => `$${formatValue(value)}`,
    },
    {
      title: t('character'),
      dataIndex: 'character',
      key: 'character',
    },
    {
      title: t('description'),
      dataIndex: 'description',
      key: 'description',
    },
  ];

  return (
    <LayoutPage title={response.name}>
      <>
        <Space direction='vertical' size='middle' style={{ display: 'flex' }}>
          <Flex dir='horizontal' gap={10} justify='flex-end'>
            {response.canResendApplication && <Button loading={loading} size='small' onClick={() => alterCharacter(response.id)}>{t('resendApplication')}</Button>}
            {response.canApplyNamechange && <Button loading={loading} size='small' onClick={() => alterCharacter(response.id)}>{t('applyNamechange')}</Button>}
            <Popconfirm
              title={t('deleteCharacter')}
              description={t('deleteCharacterConfirm')}
              onConfirm={() => deleteCharacter(response.id)}
              okText={t('yes')}
              cancelText={t('no')}
            >
              <Button loading={loading} size='small' danger>{t('delete')}</Button>
            </Popconfirm>
          </Flex>

          <Card title={t('informations')} variant="borderless">
            <Descriptions layout="vertical" items={items} colon={false} column={4} />
          </Card>

          <Table
            title={() => t('vehicles')}
            columns={columnsVehicles}
            dataSource={response.vehicles}
            loading={loading}
            pagination={false}
            locale={{ emptyText: t('characterWithoutVehicles') }}
          />

          <Table
            title={() => t('properties')}
            columns={columnsProperties}
            dataSource={response.properties}
            loading={loading}
            pagination={false}
            locale={{ emptyText: t('characterWithoutProperties') }}
          />

          <Table
            title={() => t('companies')}
            columns={columnsCompanies}
            dataSource={response.companies}
            loading={loading}
            pagination={false}
            locale={{ emptyText: t('characterWithoutCompanies') }}
          />
        </Space>

        {openCompanySaveMovementsModal && <Modal open={true} title={titleCompanySafeMovements}
          onCancel={handleCompanySaveMovementsModalCancel} footer={null} width={'90%'}>
          <Row gutter={16}>
            <Col span={24}>
              <Input placeholder={t('searchHere')} value={searchCompanySafeMovements} onChange={(e) => setSearchCompanySafeMovements(e.target.value)} />
            </Col>
          </Row>
          <Table
            columns={columnsCompanySafeMovements}
            dataSource={companySafeMovements}
            locale={{ emptyText: t('companyWithoutSafeMovements') }}
            style={{ marginTop: '10px' }}
          />
        </Modal>}

        {vehicleCharactersWithAccess && <Modal open={true} title={`${vehicleCharactersWithAccess.model} ${vehicleCharactersWithAccess.plate} - ${t('charactersWithAccess')}`}
          onCancel={handleVehicleCharactersWithAccessModalCancel} onOk={handleVehicleCharactersWithAccessModalSave}
          okText={t('save')} cancelText={t('close')}>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item>
                <Select mode='tags' value={vehicleCharactersWithAccess.charactersWithAccess}
                  onChange={(value: any) => setVehicleCharactersWithAccess({ ...vehicleCharactersWithAccess, charactersWithAccess: value })} />
              </Form.Item>
            </Col>
          </Row>
        </Modal>}

        {propertyCharactersWithAccess && <Modal open={true} title={`${propertyCharactersWithAccess.number} ${propertyCharactersWithAccess.address} - ${t('charactersWithAccess')}`}
          onCancel={handlePropertyCharactersWithAccessModalCancel} onOk={handlePropertyCharactersWithAccessModalSave}
          okText={t('save')} cancelText={t('close')}>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item>
                <Select mode='tags' value={propertyCharactersWithAccess.charactersWithAccess}
                  onChange={(value: any) => setPropertyCharactersWithAccess({ ...propertyCharactersWithAccess, charactersWithAccess: value })} />
              </Form.Item>
            </Col>
          </Row>
        </Modal>}
      </>
    </LayoutPage>
  );
};

export default CharacterPage;