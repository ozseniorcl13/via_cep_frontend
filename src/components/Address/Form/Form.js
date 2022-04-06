import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { Formik, Field, Form } from 'formik';


import UIButton from 'components/UI/Button/Button';
import './Form.css';
import Loader from 'components/UI/Loader/Loader';

const initialValue = {
  cep: '',
  rua: '',
  numero: '',
  bairro: '',
  cidade: '',
  estado: '',
  complemento: '',
  ponto_referencia: '',
}

const AddressForm = ({ id }) => {
  const [values, setValues] = useState(id ? null : initialValue)
  const history = useHistory();

  async function onBlur(ev, setFieldValue) {
    const { value } = ev.target

    const cep = value?.replace(/[^0-9]/g, '');

    const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
    const { data } = response;

    console.log(data);

    setFieldValue('rua', data.logradouro);
    setFieldValue('bairro', data.bairro);
    setFieldValue('cidade', data.localidade);
    setFieldValue('estado', data.uf);

    console.log(values);
  }

  useEffect(() => {
    async function loadData() {
      if (id) {
        const response = await axios.get(`http://localhost:5000/address/${id}`);
        setValues(response.data)
      }
    }
    loadData()
  }, [id]);

  function onSubmit(values) {
    const method = id ? 'put' : 'post';
    const url = id 
      ? `http://localhost:5000/address/${id}`
      : 'http://localhost:5000/address'
    
    axios[method](url, values)
      .then(() => {
        history.push('/');
      });
  }

  return (
    <div>
      <h1>{id ? 'Editar endereço' : 'Novo endereço'}</h1>

      {!values 
        ? ( 
          <Loader />
        ) : (
          <Formik 
            onSubmit={onSubmit}
            validateOnMount
            initialValues={id ? values : initialValue}
          >
            { props => (
              <Form>
                <div className='address-form__group'>
                  <label htmlFor='nome'>Nome</label>
                  <Field name='nome' type='text' />
                  <label htmlFor='cep'>CEP</label>
                  <Field name='cep' type='text' onBlur={(ev) => {onBlur(ev, props.setFieldValue)}} />
                  <label htmlFor='rua'>Rua</label>
                  <Field name='rua' type='text' disabled />
                  <label htmlFor='numero'>Número</label>
                  <Field name='numero' type='text' />                  
                  <label htmlFor='bairro'>Bairro</label>
                  <Field name='bairro' type='text' disabled/>
                  <div className='select-group'>
                    <label htmlFor='cidade'>Cidade</label>
                    <Field as='select' disabled>
                      <option value='cidade'>{values.cidade}</option>
                    </Field>
                    <label htmlFor='estado'>Estado</label>
                    <Field as='select' disabled>
                      <option value='estado'>{values.estado}</option>
                    </Field>
                  </div>
                  {/* <Field name='estado' type='text' disabled/> */}
                  {/* <label htmlFor='estado' disabled>Estado</label>
                  <Field name='estado' type='text' disabled /> */}
                  <label htmlFor='complemento'>Complemento</label>
                  <Field name='complemento' type='text' />
                  <label htmlFor='pont_referencia'>Ponto de referência</label>
                  <Field name='ponto_referencia' type='text' />
                  <div>
                    <UIButton type='submit' theme='contained'>Salvar</UIButton>
                  </div>
                </div>
              </Form>  
            )}  
          </Formik>
        )}
    </div>
  );
}

export default AddressForm;