import { useState, Fragment } from 'react';
import { useForm } from 'react-hook-form';
import loading_icon from '../images/loading-button.gif';
const DATAFIELDTYPES = {
  TEXTBLOCK: 'TEXTBLOCK',
  TEXT: 'TEXT',
  NUMBER: 'NUMBER',
  DATE: 'DATE',
  FILE: 'FILE',
  CHECKBOX: 'CHECKBOX',
  OPTION: 'OPTION',
  DROPDOWN: 'DROPDOWN',
};

const WorkflowForm = (props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [state, setState] = useState({
    submitting: false,
  });
  const SubmitDocument = () => {};

  return (
    <form
      className='rounded border col-12 col-sm-6 d-block m-2 p-2'
      onSubmit={handleSubmit(SubmitDocument)}>
      {props.data.map((datafield) => {
        switch (datafield.type) {
          case DATAFIELDTYPES.CHECKBOX:
            return (
              <Fragment key={datafield.id}>
                <div className='form-check'>
                  <input
                    {...register(datafield.name, {
                      required: datafield.required,
                    })}
                    type='checkbox'
                    className='form-check-input'
                    id={datafield.id}
                    name={datafield.name}
                    value={state[datafield.name] || false}
                    onChange={(event) =>
                      setState((state) => ({
                        ...state,
                        [datafield.name]: event.target.value,
                      }))
                    }
                  />
                  <label className='form-check-label' htmlFor={datafield.id}>
                    {datafield.label}
                  </label>
                </div>
                {errors[datafield.name]?.type === 'required' && (
                  <span className='text-danger'>Field must be checked</span>
                )}
              </Fragment>
            );
          case DATAFIELDTYPES.TEXTBLOCK:
            return (
              <Fragment key={datafield.id}>
                <div className='form-group'>
                  <label htmlFor={datafield.id}>{datafield.label}</label>
                  <textarea
                    {...register(datafield.name, {
                      required: datafield.required,
                      maxLength: datafield.max_chars,
                    })}
                    className='form-control'
                    id={datafield.id}
                    cols={24}
                    rows={8}
                    name={datafield.name}
                    value={state[datafield.name] || ''}
                    onChange={(event) =>
                      setState((state) => ({
                        ...state,
                        [datafield.name]: event.target.value,
                      }))
                    }
                  />
                </div>
                {errors[datafield.name]?.type === 'required' && (
                  <span className='text-danger'>Field is required</span>
                )}
                {errors[datafield.name]?.type === 'maxLength' && (
                  <span className='text-danger'>{`Maximum character exceeded. (maximum: ${datafield.max_chars})`}</span>
                )}
              </Fragment>
            );
          case DATAFIELDTYPES.TEXT:
            return (
              <Fragment key={datafield.id}>
                <div className='form-group'>
                  <label htmlFor={datafield.id}>{datafield.label}</label>
                  <input
                    {...register(datafield.name, {
                      required: datafield.required,
                      maxLength: datafield.max_chars,
                    })}
                    type={datafield.is_email ? 'email' : 'text'}
                    className='form-control'
                    id={datafield.id}
                    name={datafield.name}
                    value={state[datafield.name] || ''}
                    onChange={(event) =>
                      setState((state) => ({
                        ...state,
                        [datafield.name]: event.target.value,
                      }))
                    }
                  />
                </div>
                {errors[datafield.name]?.type === 'required' && (
                  <span className='text-danger'>Field is required</span>
                )}
                {errors[datafield.name]?.type === 'maxLength' && (
                  <span className='text-danger'>{`Maximum character exceeded. (maximum: ${datafield.max_chars})`}</span>
                )}
              </Fragment>
            );
          case DATAFIELDTYPES.DATE:
            return (
              <Fragment key={datafield.id}>
                <div className='form-group'>
                  <label htmlFor={datafield.id}>{datafield.label}</label>
                  <input
                    {...register(datafield.name, {
                      required: datafield.required,
                      min: datafield.min,
                      max: datafield.max,
                    })}
                    type='date'
                    className='form-control'
                    id={datafield.id}
                    name={datafield.name}
                    value={state[datafield.name] || ''}
                    onChange={(event) =>
                      setState((state) => ({
                        ...state,
                        [datafield.name]: event.target.value,
                      }))
                    }
                  />
                </div>
                {errors[datafield.name]?.type === 'required' && (
                  <span className='text-danger'>Field is required</span>
                )}
                {errors[datafield.name]?.type === 'min' && (
                  <span className='text-danger'>{`Date can't be before ${datafield.min}`}</span>
                )}
                {errors[datafield.name]?.type === 'max' && (
                  <span className='text-danger'>{`Date can't be after ${datafield.max}`}</span>
                )}
              </Fragment>
            );
          case DATAFIELDTYPES.NUMBER:
            return (
              <Fragment key={datafield.id}>
                <div className='form-group'>
                  <label htmlFor={datafield.id}>{datafield.label}</label>
                  <input
                    {...register(datafield.name, {
                      required: datafield.required,
                      min: datafield.min || false,
                      max: datafield.max || false,
                      pattern: (datafield.is_staff_id && /1[0-9]{5}/) || false,
                    })}
                    type='number'
                    className='form-control'
                    id={datafield.id}
                    name={datafield.name}
                    value={state[datafield.name] || ''}
                    onChange={(event) =>
                      setState((state) => ({
                        ...state,
                        [datafield.name]: event.target.value,
                      }))
                    }
                  />
                </div>
                {errors[datafield.name]?.type === 'required' && (
                  <span className='text-danger'>Field is required</span>
                )}
                {errors[datafield.name]?.type === 'min' && (
                  <span className='text-danger'>{`Value can't be below ${datafield.min}`}</span>
                )}
                {errors[datafield.name]?.type === 'max' && (
                  <span className='text-danger'>{`Value can't be more than ${datafield.max}`}</span>
                )}
              </Fragment>
            );
          case DATAFIELDTYPES.FILE:
            return (
              <Fragment key={datafield.id}>
                <div className='form-group'>
                  <label htmlFor={datafield.id}>{datafield.label}</label>
                  <input
                    {...register(datafield.name, {
                      required: datafield.required,
                    })}
                    type='file'
                    accept='application/pdf,image/*,.docx,.doc,.xls,.xlsx'
                    size={10 * 1024 * 1024}
                    className='form-control'
                    id={datafield.id}
                    name={datafield.name}
                    value={state[datafield.name] || ''}
                    onChange={(event) =>
                      setState((state) => ({
                        ...state,
                        [datafield.name]: event.target.value,
                      }))
                    }
                  />
                </div>
                {errors[datafield.name]?.type === 'required' && (
                  <span className='text-danger'>Field is required</span>
                )}
              </Fragment>
            );
          case DATAFIELDTYPES.DROPDOWN:
            return (
              <Fragment key={datafield.id}>
                <div className='form-group'>
                  <label htmlFor={datafield.id}>{datafield.label}</label>
                  <select
                    {...register(datafield.name, {
                      required: datafield.required,
                    })}
                    className='custom-select'
                    id={datafield.id}
                    name={datafield.name}
                    value={state[datafield.name] || ''}
                    onChange={(event) =>
                      setState((state) => ({
                        ...state,
                        [datafield.name]: event.target.value,
                      }))
                    }>
                    {JSON.parse(datafield.options).map((option) => (
                      <option value={option.value} key={option.name}>
                        {option.name}
                      </option>
                    ))}
                  </select>
                </div>
                {errors[datafield.name]?.type === 'required' && (
                  <span className='text-danger'>Field is required</span>
                )}
              </Fragment>
            );
          case DATAFIELDTYPES.OPTION:
            return (
              <Fragment key={datafield.id}>
                {JSON.parse(datafield.options).map((option) => (
                  <div
                    className='form-check form-check-inline'
                    key={option.name}>
                    <input
                      class='form-check-input'
                      type='radio'
                      name={datafield.name}
                      id={option.name}
                      value={option.value}
                      onSelect={(event) =>
                        setState((state) => ({
                          ...state,
                          [datafield.name]: event.target.value,
                        }))
                      }
                    />
                    <label class='form-check-label' htmlFor={option.name}>
                      {option.name}
                    </label>
                  </div>
                ))}
              </Fragment>
            );
          default:
            return <></>;
        }
      })}

      {state.submitting ? (
        <img
          className='d-block mx-auto my-3 text-center'
          alt=''
          src={loading_icon}
        />
      ) : (
        <input
          className='d-block mx-auto my-3 btn btn-dark'
          type='submit'
          value='Submit'
        />
      )}
    </form>
  );
};

export default WorkflowForm;
