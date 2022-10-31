import { useState } from 'react';
import { Modal } from 'antd';
import funcModel from '@src/components/func-modal';

interface ValueData {
  name: string;
}

interface Props {
  id: string;
  onClose: (val?: ValueData) => void;
}

const CreateModal: React.FC<Props> = ({ onClose, id }) => {
  console.log('id', id);
  const [visible, setVisible] = useState(true);

  const handleCancel = () => {
    setVisible(false);
    onClose();
  };

  const handleOk = () => {
    setVisible(false);
    onClose({
      name: '确定',
    });
  };

  return (
    <Modal
      title='新增员工'
      open={visible}
      onCancel={handleCancel}
      onOk={handleOk}
    >
      <p>Some contents...</p>
    </Modal>
  );
};

const funcCreateModal = ({ id }: { id: string }) => {
  return funcModel<ValueData>({
    Component: CreateModal,
    props: {
      id: id,
    },
  });
};

export default funcCreateModal;
