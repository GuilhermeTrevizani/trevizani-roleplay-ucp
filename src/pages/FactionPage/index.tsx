import {
  Button, Col, ColorPicker, Flex, Form, Input, InputNumber, Modal, Popconfirm, Row,
  Select, Table, Tabs, type TabsProps, Tag, Tooltip
} from 'antd';
import { useEffect, useState } from 'react';
import { t } from 'i18next';
import type { ColumnsType } from 'antd/es/table';
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { DndContext, type DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { formatDateTime, formatValue, removeAccents } from '../../services/format';
import { FactionFlag } from '../../types/FactionFlag';
import type SelectOptionResponse from '../../types/SelectOptionResponse';
import type FactionRank from '../../types/FactionRank';
import LayoutPage from '../LayoutPage';
import { useNavigate, useParams } from 'react-router-dom';
import { useApi } from '../../hooks/useApi';
import type FactionCharacter from '../../types/FactionCharacter';
import type FactionVehicle from '../../types/FactionVehicle';
import { useNotification } from '../../hooks/useNotification';

const FactionPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const api = useApi();
  const notification = useNotification();

  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [flags, setFlags] = useState<SelectOptionResponse[]>([]);

  const [members, setMembers] = useState<FactionCharacter[]>([]);
  const [originalMembers, setOriginalMembers] = useState<FactionCharacter[]>([]);
  const [searchMember, setSearchMember] = useState('');

  const [ranks, setRanks] = useState<FactionRank[]>([]);
  const [originalRanks, setOriginalRanks] = useState<FactionRank[]>([]);
  const [searchRank, setSearchRank] = useState('');

  const [hasDuty, setHasDuty] = useState(false);
  const [isLeader, setIsLeader] = useState(true);
  const [factionFlags, setFactionFlags] = useState<FactionFlag[]>([]);
  const [factionColor, setFactionColor] = useState('FFFFFF');
  const [factionChatColor, setFactionChatColor] = useState('FFFFFF');

  const [isRankModal, setRankModal] = useState(false);
  const [rankId, setRankId] = useState('');
  const [rankName, setRankName] = useState('');

  const [isMemberModal, setMemberModal] = useState(false);
  const [memberId, setMemberId] = useState('');
  const [memberRank, setMemberRank] = useState('');
  const [memberFlags, setMemberFlags] = useState<FactionFlag[]>([]);

  const [originalVehicles, setOriginalVehicles] = useState<FactionVehicle[]>([]);
  const [vehicles, setVehicles] = useState<FactionVehicle[]>([]);
  const [vehicle, setVehicle] = useState<FactionVehicle>();
  const [searchVehicle, setSearchVehicle] = useState('');

  useEffect(() => {
    getInfo();
  }, []);

  const getInfo = () => {
    setLoading(true);
    api.getMyFaction(id!)
      .then(res => {
        setFlags(res.flagsOptions);
        setOriginalRanks(res.ranks);
        setOriginalMembers(res.characters);
        setTitle(res.name);
        setHasDuty(res.hasDuty);
        setFactionFlags(res.userFlags);
        setIsLeader(res.isLeader);
        setFactionColor(res.color);
        setFactionChatColor(res.chatColor);
        setOriginalVehicles(res.vehicles);
      })
      .catch(res => {
        notification.alert('error', res);
        navigate('/my-factions');
      })
      .finally(() => {
        setLoading(false);
      });
  };

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

  const editMember = (member: FactionCharacter) => {
    setMemberModal(true);
    setMemberId(member.id);
    setMemberRank(member.rankId);
    setMemberFlags(JSON.parse(member.flagsJson));
  };

  const removeMember = (id: string) => {
    setLoading(true);
    api.removeFactionMember(id)
      .then(() => {
        notification.alert('success', t('recordRemoved'));
        getInfo();
      })
      .catch(res => {
        notification.alert('error', res);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const confirmMemberModal = () => {
    setLoading(true);
    api.saveFactionMember({ factionId: id!, id: memberId, factionRankId: memberRank, flags: memberFlags })
      .then(() => {
        notification.alert('success', t('recordSaved'));
        getInfo();
      })
      .catch(res => {
        notification.alert('error', res);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const cancelMemberModal = () => {
    setMemberModal(false);
    setMemberId('');
    setMemberRank('');
    setMemberFlags([]);
  };

  const addRank = () => {
    setRankModal(true);
    setRankId('');
    setRankName('');
  };

  const editRank = (rank: FactionRank) => {
    setRankModal(true);
    setRankId(rank.id);
    setRankName(rank.name);
  };

  const confirmRankModal = () => {
    setLoading(true);
    api.saveFactionRank({ factionId: id!, id: rankId, name: rankName })
      .then(() => {
        notification.alert('success', t('recordSaved'));
        getInfo();
      })
      .catch(res => {
        notification.alert('error', res);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const cancelRankModal = () => {
    setRankModal(false);
    setRankId('');
    setRankName('');
  };

  const removeRank = (id: string) => {
    setLoading(true);
    api.removeFactionRank(id)
      .then(() => {
        notification.alert('success', t('recordRemoved'));
        getInfo();
      })
      .catch(res => {
        notification.alert('error', res);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const editVehicle = (vehicle: FactionVehicle) => {
    setVehicle(vehicle);
  };

  const confirmVehicleModal = () => {
    setLoading(true);
    api.saveFactionVehicle({ factionId: id!, id: vehicle!.id, description: vehicle!.description })
      .then(() => {
        notification.alert('success', t('recordSaved'));
        getInfo();
      })
      .catch(res => {
        notification.alert('error', res);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const cancelVehicleModal = () => {
    setVehicle(undefined);
  };

  useEffect(() => {
    if (searchVehicle == '') {
      setVehicles(originalVehicles);
      return;
    }

    const newSearch = removeAccents(searchVehicle);
    const filteredItems = originalVehicles.filter(x =>
      removeAccents(x.model).includes(newSearch)
      || removeAccents(x.plate).includes(newSearch) || removeAccents(x.description).includes(newSearch)
    );
    setVehicles(filteredItems);
  }, [searchVehicle, originalVehicles]);

  const columnsMembers: ColumnsType<FactionCharacter> = [
    {
      title: t('rank'),
      dataIndex: 'rankName',
      key: 'rankName',
    },
    {
      title: t('name'),
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: FactionCharacter) => <>{name} <Tag color={record.isOnline ? 'green' : 'red'}>{record.isOnline ? 'online' : 'offline'}</Tag></>,
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
    {
      title: t('averageServiceDay'),
      dataIndex: 'averageMinutesOnDutyLastTwoWeeks',
      key: 'averageMinutesOnDutyLastTwoWeeks',
      render: (averageMinutesOnDutyLastTwoWeeks: number) => <Tooltip title={t('averageServiceDayTip')}>{averageMinutesOnDutyLastTwoWeeks.toFixed(1)} {t('minutes').toLowerCase()}</Tooltip>,
      hidden: !hasDuty,
    },
    {
      title: t('flags'),
      dataIndex: 'flags',
      key: 'flags',
      render: (flags: string[]) => flags.map(x => <Tag style={{ marginBottom: '2px' }}>{x}</Tag>),
    },
    {
      title: t('options'),
      dataIndex: 'id',
      key: 'options',
      align: 'center',
      render: (id: string, member: FactionCharacter) => <Flex justify='space-evenly'>
        <Button disabled={!factionFlags.includes(FactionFlag.EditMember) && !isLeader} size='small' onClick={() => editMember(member)}>{t('edit')}</Button>
        <Popconfirm
          title={t('deleteRecord')}
          description={t('deleteRecordConfirm')}
          onConfirm={() => removeMember(id)}
          okText={t('yes')}
          cancelText={t('no')}
        >
          <Button disabled={!factionFlags.includes(FactionFlag.RemoveMember) && !isLeader} danger size='small'>{t('delete')}</Button>
        </Popconfirm>
      </Flex>
    },
  ];

  interface RowProps extends React.HTMLAttributes<HTMLTableRowElement> {
    'data-row-key': string;
  }

  const RankRow = (props: RowProps) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
      id: props['data-row-key'],
    });

    const style: React.CSSProperties = {
      ...props.style,
      transform: CSS.Translate.toString(transform),
      transition,
      cursor: 'move',
      ...(isDragging ? { position: 'relative', zIndex: 9999 } : {}),
    };

    return <tr {...props} ref={setNodeRef} style={style} {...attributes} {...listeners} />;
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 1,
      },
    }),
  );

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (active.id !== over?.id) {
      setOriginalRanks((prev) => {
        const activeIndex = prev.findIndex((i) => i.id === active.id);
        const overIndex = prev.findIndex((i) => i.id === over?.id);
        const newArray = arrayMove(prev, activeIndex, overIndex);
        setRanks(newArray);
        const sendArray = newArray.map((value, index) => ({ id: value.id, position: index + 1 }));
        setLoading(true);
        api.orderFactionRanks({ factionId: id!, ranks: sendArray })
          .then(() => {
            notification.alert('success', t('recordSaved'));
            getInfo();
          })
          .catch(res => {
            notification.alert('error', res);
          })
          .finally(() => {
            setLoading(false);
          });
        return newArray;
      });
    }
  };

  const save = () => {
    setLoading(true);
    api.saveFaction({ id: id!, chatColor: factionChatColor, color: factionColor })
      .then(() => {
        notification.alert('success', t('recordSaved'));
      })
      .catch(res => {
        notification.alert('error', res);
      })
      .finally(() => {
        setLoading(false);
      });
  };

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
      hidden: !hasDuty,
      render: (salary: number) => `$${formatValue(salary)}`,
    },
    {
      title: t('options'),
      dataIndex: 'id',
      key: 'options',
      align: 'center',
      hidden: !isLeader,
      render: (id: string, rank: FactionRank) => <Flex justify='space-evenly'>
        <Button size='small' onClick={() => editRank(rank)}>{t('edit')}</Button>
        <Popconfirm
          title={t('deleteRecord')}
          description={t('deleteRecordConfirm')}
          onConfirm={() => removeRank(id)}
          okText={t('yes')}
          cancelText={t('no')}
        >
          <Button danger size='small'>{t('delete')}</Button>
        </Popconfirm>
      </Flex>
    },
  ];

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
      render: (_, vehicle: FactionVehicle) =>
        <Button disabled={!factionFlags.includes(FactionFlag.ManageVehicles)} size='small' onClick={() => editVehicle(vehicle)}>{t('edit')}</Button>,
    },
  ];

  const items: TabsProps['items'] = [
    {
      key: t('members'),
      label: t('members'),
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
          pagination={false}
          style={{ marginTop: '10px' }}
        />
      </>,
    },
    {
      key: t('ranks'),
      label: t('ranks'),
      children: <>
        <Row gutter={16}>
          <Col span={22}>
            <Input placeholder={t('searchHere')} value={searchRank} onChange={(e) => setSearchRank(e.target.value)} />
          </Col>
          <Col span={2}>
            <Button disabled={!isLeader} style={{ width: '100%' }} onClick={addRank}>{t('add')}</Button>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <DndContext sensors={sensors} modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
              <SortableContext
                items={ranks.map((i) => i.id)}
                strategy={verticalListSortingStrategy}
                disabled={!isLeader}
              >
                <Table
                  components={{
                    body: {
                      row: RankRow,
                    },
                  }}
                  rowKey='id'
                  columns={columnsRanks}
                  dataSource={ranks}
                  loading={loading}
                  pagination={false}
                  style={{ marginTop: '10px' }}
                />
              </SortableContext>
            </DndContext>
          </Col>
        </Row>
      </>,
    },
    {
      key: t('faction'),
      label: t('faction'),
      children: <>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label={t('color')}>
              <ColorPicker size='large' disabledAlpha value={factionColor} onChange={(e) => setFactionColor(e.toHexString())} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label={t('chatColor')}>
              <ColorPicker size='large' disabledAlpha value={factionChatColor} onChange={(e) => setFactionChatColor(e.toHexString())} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Button disabled={!isLeader} loading={loading} onClick={save}>{t('save')}</Button>
          </Col>
        </Row>
      </>,
    },
    {
      key: t('vehicles'),
      label: t('vehicles'),
      children: <>
        <Row gutter={16}>
          <Col span={24}>
            <Input placeholder={t('searchHere')} value={searchVehicle} onChange={(e) => setSearchVehicle(e.target.value)} />
          </Col>
        </Row>
        <Table
          columns={columnsVehicles}
          dataSource={vehicles}
          loading={loading}
          pagination={false}
          style={{ marginTop: '10px' }}
        />
      </>,
    },
  ];

  return <LayoutPage title={title}>
    <>
      <Tabs defaultActiveKey="1" items={items} />

      <Modal open={isRankModal} title={(rankId != '' ? t('edit') : t('add')) + ' ' + t('rank')}
        onOk={confirmRankModal} onCancel={cancelRankModal} confirmLoading={loading}
        cancelText={t('close')} okText={t('save')} >
        <Form layout='vertical'>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item label={t('name')}>
                <Input value={rankName} onChange={(e) => setRankName(e.target.value)} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      <Modal open={isMemberModal} title={t('edit') + ' ' + t('member')}
        onOk={confirmMemberModal} onCancel={cancelMemberModal} confirmLoading={loading}
        cancelText={t('close')} okText={t('save')} >
        <Form layout='vertical'>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item label={t('rank')}>
                <Select value={memberRank} options={ranks.map(x => ({ value: x.id, label: x.name }))}
                  onChange={(value) => setMemberRank(value)} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item label={t('flags')}>
                <Select mode='multiple' value={memberFlags} options={flags}
                  onChange={(value) => setMemberFlags(value)} optionFilterProp='label' />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {vehicle && <Modal open={true} title={`${vehicle.model} ${vehicle.plate}`}
        onOk={confirmVehicleModal} onCancel={cancelVehicleModal} confirmLoading={loading}
        cancelText={t('close')} okText={t('save')} >
        <Form layout='vertical'>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item label={t('description')}>
                <Input value={vehicle.description}
                  onChange={(e) => setVehicle({ ...vehicle, description: e.target.value })}
                  maxLength={100} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>}
    </>
  </LayoutPage>
};

export default FactionPage;