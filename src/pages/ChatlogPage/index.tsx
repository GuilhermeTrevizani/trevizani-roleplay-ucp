import { t } from 'i18next';
import LayoutPage from '../LayoutPage';
import { useState } from 'react';
import { Button, Col, Form, Row } from 'antd';
import TextArea from 'antd/es/input/TextArea';

const ChatlogPage = () => {
  const [originalText, setOriginalText] = useState('');
  const [convertedText, setConvertedText] = useState('');

  const convert = () => {
    const lines = originalText.split('\n');
    const filteredLines = lines
      .filter(line => !line.includes('[Error]') && !line.includes('[Warning]'))
      .map(line => (line.split('[js]')[1] ?? '').trim());
    const result = filteredLines.join('\n');
    setConvertedText(result);
  };

  return (
    <LayoutPage title={t('chatlog')}>
      <Form layout='vertical'>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label={t('originalText')}>
              <TextArea value={originalText} onChange={(e) => setOriginalText(e.target.value)} rows={20} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={t('convertedText')}>
              <TextArea value={convertedText} readOnly rows={20} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16} style={{ textAlign: 'right' }}>
          <Col span={24}>
            <Button onClick={convert} type='primary'>{t('convert')}</Button>
          </Col>
        </Row>
      </Form>
    </LayoutPage>
  );
};

export default ChatlogPage;