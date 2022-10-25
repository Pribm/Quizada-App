import { Button, CircularProgress, FormControl, Grid, InputBase, InputLabel, Paper,  Select,  TextField } from '@mui/material'

import MenuWrapper from 'components/wrappers/MenuWrapper'
import { HttpAuth } from 'config/Http'
import React from 'react'
import { BiCreditCard } from 'react-icons/bi'
import { HiQrcode } from 'react-icons/hi'
import { MdQrCode } from 'react-icons/md'
import NumberFormat from 'react-number-format'
import { useDispatch, useSelector } from 'react-redux'
import { changeAlert } from 'store/Actions/alert.action'

const NumberField = React.forwardRef(function NumberField(props, ref) {

    const { onChange, ...other } = props;

    return (
        <NumberFormat
            {...other}
            allowLeadingZeros={false}
            getInputRef={ref}
            prefix={'R$'}
            isNumericString={true}
            thousandSeparator={'.'}
            decimalSeparator={','}
            decimalScale={2}
            allowedDecimalSeparators={[',','.']}

            onValueChange={(values) => {
                onChange({
                    target: {
                        name: props.name,
                        value: parseFloat(values.value).toFixed(2),
                    },
                });
            }}
        />
    );
});


const Donate = () => {

    const dispatch = useDispatch()
    const {appData} = useSelector(state => state.appReducer)

    React.useEffect(() => {
            const script = document.createElement("script");

            script.src = "https://sdk.mercadopago.com/js/v2";
            script.async = true;

            script.onload = () => {
                let mp = new window.MercadoPago(process.env.REACT_APP_MERCADO_PAGO_PUBLIC_KEY)
                
                const getIdentificationTypes = async () => {
                    try {
                        const identificationTypes = await mp.getIdentificationTypes();
                        const identificationTypeElement = document.getElementById('form-checkout__identificationType');

                        createSelectOptions(identificationTypeElement, identificationTypes);
                    } catch (e) {
                        return console.error('Error getting identificationTypes: ', e);
                    }
                }
                getIdentificationTypes()
            }
        
            document.body.appendChild(script);
        
       return () => document.body.removeChild(script)
    }, [])

    const [qrCode, setQrCode] = React.useState('')
    const [pixForm, setPixForm] = React.useState({
        name: '',
        surName: '',
        email: '',
        docType: "CPF",
        docNumber: '',
        amount: 0
    })
    
    function createSelectOptions(elem, options, labelsAndKeys = { label: "name", value: "id" }) {
        const { label, value } = labelsAndKeys;
  
        elem.options.length = 0;
  
        const tempOptions = document.createDocumentFragment();
  
        options.forEach(option => {
          const optValue = option[value];
          const optLabel = option[label];
  
          const opt = document.createElement('option');
          opt.value = optValue;
          opt.textContent = optLabel;
  
          tempOptions.appendChild(opt);
        });
  
        elem.appendChild(tempOptions);
      }

      const handlePaymentPixSubmit = e => {
        e.preventDefault()
        HttpAuth.post('process_payment', pixForm).then(res => setQrCode(res.data.point_of_interaction.transaction_data.qr_code_base64))
      }

  return (
    <div className='container md:w-[60vw] mx-[auto] p-4 flex flex-wrap justify-center'>
            <Grid container spacing={2} className='bg-slate-50 rounded-md shadow-lg' padding={4}>
                  <Grid item xs={12} md={5} padding={4} component={Paper}>
                      {
                        Object.keys(appData).length <= 0 ?
                        <div className='flex justify-center my-4'>
                            <CircularProgress/>
                        </div>
                        :
                        <div className='w-[100%]'>
                            <h1 className='text-3xl text-blue-600 uppercase mb-2'>{appData.payment_title}</h1>
                            <hr />
                            <h3 className='text-xl text-blue-400 uppercase mt-2 mb-2 w-[100%]'>{appData.payment_text}</h3>
                            <hr />
                        </div>
                      }
                      <h4 className='mt-4'>Escolha como deseja contribuir</h4>
                      <Button fullWidth variant='contained' className='mt-2' disabled>
                          <BiCreditCard size={20} className='mr-2' />
                          Cartão de Crédito - Em Breve
                      </Button>
                      <Button fullWidth variant='contained' className='mt-2' color={'success'}>
                          <HiQrcode size={20} className='mr-2' />
                          Pix
                      </Button>
                  </Grid>

                  <Grid item xs={12} md={7}>
                    <Paper className='p-4'>
                          <form id="form-checkout" action="http://localhost:8000/api/process_payment" method="post" onSubmit={handlePaymentPixSubmit}>
                              <Grid container spacing={2}>
                                  <Grid item md={6} xs={12}>
                                      <TextField
                                      value={pixForm.name || ''}
                                      onChange={e => setPixForm({...pixForm, name: e.target.value})}
                                      fullWidth
                                      id="form-checkout__payerFirstName"
                                      name="payerFirstName"
                                      type="text"
                                      size='small'
                                      label='Nome'/>
                                  </Grid>
                                  <Grid item md={6} xs={12}>
                                      <TextField
                                      value={pixForm.surName || ''}
                                      onChange={e => setPixForm({...pixForm, surName: e.target.value})}
                                      fullWidth
                                      size={'small'}
                                      id="form-checkout__payerLastName"
                                      name="payerLastName"
                                      type="text"
                                      label="Sobrenome"/>
                                  </Grid>
                                  <Grid item md={12} xs={12}>
                                      <TextField
                                      value={pixForm.email || ''}
                                      onChange={e => setPixForm({...pixForm, email: e.target.value})}
                                      fullWidth
                                      size={"small"}
                                      id="form-checkout__email"
                                      name="email"
                                      type="text"
                                      label="E-mail"/>
                                  </Grid>
                                <Grid item md={3} xs={12}>
                                    <FormControl fullWidth size="small">
                                        <Select
                                        value={pixForm.docType}
                                        onChange={e => setPixForm({...pixForm, docType: e.target.value})}
                                        native
                                        id="form-checkout__identificationType"
                                        name="identificationType"
                                        type="text"
                                        >

                                        </Select>
                                    </FormControl>
                                  </Grid>
                                  <Grid item md={6} xs={12}>
                                      <TextField
                                      value={pixForm.docNumber || ''}
                                      onChange={e => setPixForm({...pixForm, docNumber: e.target.value})}
                                      fullWidth
                                      size='small'
                                      id="form-checkout__identificationNumber"
                                      name="identificationNumber"
                                      type="text"
                                      label="Número do documento"/>
                                  </Grid>
                                    <Grid item md={3} xs={12}>
                                        <TextField
                                        value={pixForm.amount || ''}
                                        onChange={e => setPixForm({...pixForm, amount: e.target.value})}
                                        label='valor'
                                        size='small'
                                        InputProps={{
                                            inputComponent: NumberField
                                        }}
                                        />
                                    </Grid>
                              </Grid>

                              <div>
                                  <div>
                                
                                    <input type="hidden" name="description" id="description" value="Nome do Produto"/>
                                        <br/>
                                            <Button variant='contained' type="submit">Pagar</Button>
                                        </div>
                                    </div>
                            </form>
                            
                    {
                        qrCode !== '' ?
                        <div className='flex flex-col items-center'>
                            <div className='flex flex-col items-center mt-4'>
                                <img src={`data:image/jpeg;base64,${qrCode}`} className='w-[180px] h-[180px]'/>
                            </div>
                            <TextField value={qrCode} size='small' disabled={true}/>
                            <Button
                            onClick={() => {
                                navigator.clipboard.writeText(qrCode)
                                dispatch(changeAlert({ open: true, msg: 'Código copiado para a área de transferência', class: 'success' }))
                            }}
                            variant='contained'
                            className='mt-4'
                            color='secondary'>
                                Copiar Código
                            </Button>
                        </div>
                        :
                        <div className='flex flex-col items-center mt-4'>
                            <h4>Gere o QR code para o pix acima</h4>
                            <MdQrCode size={120}/>
                        </div>
                    }
                    </Paper>
                  </Grid>
            </Grid>

    </div>
  )
}

export default MenuWrapper(Donate)