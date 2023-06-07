import {useDispatch} from "react-redux";
import {useEffect, useState} from 'react';
import {Controller, useForm} from "react-hook-form";
import {NavLink} from 'react-router-dom';
// @mui
import {Button, IconButton, InputAdornment, Stack, TextField, Typography} from '@mui/material';
import {LoadingButton} from '@mui/lab';
// components
import Iconify from '../../../components/iconify';
import Loader from "../../../components/loader/Loader";
import agent from "../../../api/agent";
import InformingPopover from "../../../components/popover/InformingPopover";

// ----------------------------------------------------------------------

export default function RegisterForm() {
  const dispatch = useDispatch();
  const {control, handleSubmit, setError, watch, formState: {errors}, reset} = useForm({
    defaultValues: {
      displayName: '',
      email: '',
      password: '',
      confirmedPassword: '',
    }
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmedPassword, setShowConfirmedPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleClick = async (data) => {
    delete data.confirmedPassword;
    setIsLoading(true);
    try {
      const response = await agent.Auth.register(data);
      setIsLoading(false)
      setSuccess(true)
    } catch (exception) {
      console.log(exception)
      setError("email", {type: "error", message: "Email is already registered"})
      setIsLoading(false)
    }
  };

  useEffect(() => {
    if (!success) {
      reset();
    }
  }, [success]);

  const password = watch('password');

  return (
      <>
        {success && <InformingPopover
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            timeOut={10000}
            setOpen={setSuccess}
        >
          <Typography variant="body2" sx={{mb: 1, color: 'success.main', textAlign: 'center'}}>
            Registered successfully
          </Typography>
          <Button
              size='small'
              component={NavLink}
              to={'/login'}
              variant='text'
              sx={{color: 'success.main'}}
          >
            Go to login
          </Button>
        </InformingPopover>}
        {isLoading && <Loader/>}
        <Stack spacing={3}>
          <Controller
              name='displayName'
              control={control}
              rules={{required: 'Name is required'}}
              render={({field}) => (
                  <TextField {...field} label="Display name"/>
              )}
          />
          {errors.name &&
              <Typography variant="subtitle2" sx={{my: 2, color: 'error.main', textAlign: 'center'}}>
                {errors.name.message}
              </Typography>}
          <Controller
              name='email'
              control={control}
              rules={{
                required: 'Email is required',
                pattern: {
                  value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                  message: 'Should be an email',
                }
              }}
              render={({field}) => (
                  <TextField type='email' {...field} label="Email address"/>
              )}
          />
          {errors.email &&
              <Typography variant="subtitle2" sx={{my: 2, color: 'error.main', textAlign: 'center'}}>
                {errors.email.message}
              </Typography>}
          <Controller
              name='password'
              control={control}
              rules={{
                required: 'Password is required',
              }}
              render={({field}) => (
                  <TextField
                      {...field}
                      label="Password"
                      type={showPassword ? 'text' : 'password'}
                      InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                              <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'}/>
                              </IconButton>
                            </InputAdornment>
                        ),
                      }}
                  />
              )}
          />
          {errors.password &&
              <Typography variant="subtitle2" sx={{my: 2, color: 'error.main', textAlign: 'center'}}>
                {errors.password.message}
              </Typography>}
          <Controller
              name='confirmedPassword'
              control={control}
              rules={{
                required: 'Please confirm password',
                validate: {
                  match: (value) => value === password || "Password does not match"
                }
              }}
              render={({field}) => (
                  <TextField
                      {...field}
                      label="Confirm Password"
                      type={showConfirmedPassword ? 'text' : 'password'}
                      InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                              <IconButton onClick={() => setShowConfirmedPassword(!showConfirmedPassword)}
                                          edge="end">
                                <Iconify
                                    icon={showConfirmedPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'}/>
                              </IconButton>
                            </InputAdornment>
                        ),
                      }}
                  />
              )}
          />
          {errors.confirmedPassword &&
              <Typography variant="subtitle2" sx={{my: 2, color: 'error.main', textAlign: 'center'}}>
                {errors.confirmedPassword.message}
              </Typography>}
        </Stack>

        <LoadingButton loading={isLoading} sx={{mt: 2}} fullWidth size="large" type="submit" variant="contained"
                       onClick={handleSubmit(handleClick)}>
          Register
        </LoadingButton>
      </>
  );
}
