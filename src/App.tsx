import React, { useState } from 'react';
import supabase from './supabaseClient';

const inputStyle = {
  width: '200px',
};

function App() {
  const [title, setTitle] = useState('');
  const [name, setName] = useState('');
  const [subMessage, setSubMessage] = useState<any>();

  const onChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };
  const onChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const posts = supabase
    .channel('custom-channel')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'posts' },
      (payload) => {
        setSubMessage(payload.new);
      }
    )
    .subscribe();

  const sendMessage = async () => {
    if (!title || !name) {
      return;
    }

    const newMessage = {
      title,
      name,
    };

    try {
      const { error } = await supabase.from('posts').insert(newMessage);
      if (error) {
        console.log(error);
      }
    } catch (e) {
      console.log('error', e);
    }
  };

  return (
    <div style={{ height: '800px', display: 'flex' }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          margin: 'auto',
          gap: '15px',
        }}
      >
        <div>
          작성자 :&nbsp;
          <input
            type="text"
            style={inputStyle}
            value={name}
            onChange={onChangeName}
          />
        </div>
        <div>
          내용 &nbsp;&nbsp;&nbsp; :&nbsp;
          <input
            type="text"
            value={title}
            style={inputStyle}
            onChange={onChangeTitle}
          />
        </div>

        <button style={{ width: '100px' }} onClick={sendMessage}>
          전송
        </button>
        {subMessage && (
          <div>
            <div>이름 : {subMessage.name}</div>
            <div>내용 : {subMessage.title}</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
