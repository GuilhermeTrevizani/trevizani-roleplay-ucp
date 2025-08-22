import { t } from 'i18next';
import LayoutPage from '../LayoutPage';
import Table, { type ColumnsType } from 'antd/es/table';
import { useEffect, useState } from 'react';
import { formatDateTime } from '../../services/format';
import { useApi } from '../../hooks/useApi';
import { useNotification } from '../../hooks/useNotification';
import { Button, Flex, Row, Space, Tag } from 'antd';
import type { MyCharactersResponse, MyCharactersCharacterResponse } from '../../types/MyCharactersResponse';
import { useNavigate } from 'react-router-dom';
import { CharacterStatus } from '../../types/CharacterStatus';

const MyCharactersPage = () => {
  const api = useApi();
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<MyCharactersResponse>({
    characters: [],
  });
  const notification = useNotification();
  const navigate = useNavigate();

  useEffect(() => {
    getMyCharacters();
  }, []);

  const getMyCharacters = () => {
    setLoading(true);
    api.getMyCharacters()
      .then(res => {
        setResponse(res);
      })
      .catch(res => {
        notification.alert('error', res);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const createCharacter = () => {
    if (response.createCharacterWarning) {
      notification.alert('error', response.createCharacterWarning);
      return;
    }

    navigate('/create-character');
  }

  const view = (id: string) => {
    navigate(`/character/${id}`);
  }

  const columns: ColumnsType<MyCharactersCharacterResponse> = [
    {
      title: t('name'),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: t('lastAccess'),
      dataIndex: 'lastAccessDate',
      key: 'lastAccessDate',
      render: (lastAccessDate: Date) => formatDateTime(lastAccessDate),
    },
    {
      title: t('status'),
      dataIndex: 'status',
      key: 'status',
      render: (_, record: MyCharactersCharacterResponse) => {
        if (record.status == CharacterStatus.CKAvaliation)
          return <Tag color={'yellow'}>{t('ckAvaliation')}</Tag>;

        if (record.status == CharacterStatus.Dead)
          return <Tag color={'red'}>{t('dead')} ({record.deathReason})</Tag>;

        if (record.status == CharacterStatus.Rejected)
          return <Tag color={'yellow'}>{t('rejected')}</Tag>;

        if (record.status == CharacterStatus.AwaitingEvaluation)
          return <Tag color={'yellow'}>{t('awaitingEvaluation')}</Tag>;

        return <Tag color={'green'}>{t('alive')}</Tag>;
      },
    },
    {
      title: t('options'),
      dataIndex: 'id',
      key: 'options',
      align: 'center',
      render: (_, record: MyCharactersCharacterResponse) => <Flex justify='space-evenly'>
        <Button size='small' onClick={() => view(record.id)}>{t('view')}</Button>
      </Flex>,
    },
  ];

  return (
    <LayoutPage title={t('myCharacters')}>
      <>
        <Space direction='vertical' size='middle' style={{ display: 'flex' }}>
          <Row itemType='flex' justify='end' align='middle'>
            <Button type='primary' onClick={createCharacter} loading={loading}>{t('createCharacter')}</Button>
          </Row>
          <Table
            columns={columns}
            dataSource={response.characters}
            pagination={false}
            loading={loading}
            locale={{ emptyText: t('noCharacters') }}
          />
        </Space>
      </>
    </LayoutPage>
  );
};

export default MyCharactersPage;