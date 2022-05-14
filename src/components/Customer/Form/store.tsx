import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import axios from 'axios';
import { yupResolver } from '@hookform/resolvers/yup';

import request from 'src/hooks/useRequest';
import { usePrefectures } from 'src/hooks/usePrefectures';
import { useOccupations } from 'src/hooks/useOccupations';
import type { User } from 'src/models/user';
import type { FormInputType } from './types';

export const useUserFormState = (userId?: number) => {
  const { t }: { t: any } = useTranslation();
  const navigate = useNavigate();

  const schema = Yup.object({
    familyName: Yup.string().required(t('Family name is required.')),
    givenName: Yup.string().required(t('Given name is required.')),
    familyNameKana: Yup.string().required(t('Family name kana is required.')),
    givenNameKana: Yup.string().required(t('Given name kana is required.')),
    postalCode: Yup.string().required(t('Postal code is required.')),
    prefecture: Yup.string().required(t('Need select prefecure')),
    address1: Yup.string().required(t('Municipalities is required.')),
    address2: Yup.string().required(t('House number is required.')),
    phoneNumber: Yup.string().required(t('Phone number is required.')),
    email: Yup.string().required(t('Email is required.'))
  }).required();

  const {
    control,
    setValue,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<FormInputType>({
    defaultValues: {
      familyName: '',
      givenName: '',
      familyNameKana: '',
      givenNameKana: '',
      postalCode: '',
      prefecture: '',
      address1: '',
      address2: '',
      address3: '',
      phoneNumber: '',
      homePhoneNumber: '',
      email: '',
      gender: 0,
      birthday: '',
      occupation: '',
      firstVisitDate: '',
      familyUserId: 0,
      familyRelationship: 0,
      memo: ''
    },
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data: FormInputType) => {
    request({
      url: Boolean(userId) ? `/v1/users/${userId}` : '/v1/users',
      method: Boolean(userId) ? 'PUT' : 'POST',
      reqParams: {
        data: {
          ...data
        }
      }
    }).then(() => {
      navigate('/dashboards/customers');
    });
  };

  const setUser = useCallback((user?: User) => {
    if (Boolean(user)) {
      setValue('familyName', user.familyName);
      setValue('givenName', user.givenName);
      setValue('familyNameKana', user.familyNameKana);
      setValue('givenNameKana', user.givenNameKana);
      setValue('postalCode', user.postalCode);
      setValue('prefecture', user.prefecture);
      setValue('address1', user.address1);
      setValue('address2', user.address2);
      setValue('address3', user.address3);
      setValue('phoneNumber', user.phoneNumber);
      setValue('homePhoneNumber', user.homePhoneNumber);
      setValue('email', user.email);
      setValue('gender', user.gender);
      setValue('birthday', user.birthday);
      setValue('occupation', user.occupation);
      setValue('firstVisitDate', user.firstVisitDate);
      setValue('memo', user.memo ? user.memo : '');
    }
  }, []);

  const updateAddress = useCallback(
    () =>
      watch((value, { name }) => {
        if (name === 'postalCode' && value.postalCode.length >= 7) {
          axios
            .get('https://zipcloud.ibsnet.co.jp/api/search', {
              params: {
                zipcode: value.postalCode
              }
            })
            .then((res) => {
              if (res['data']['results']) {
                setValue('prefecture', res['data']['results'][0]['address1']);
                setValue('address1', res['data']['results'][0]['address2']);
                setValue('address2', res['data']['results'][0]['address3']);
              }
            });
        }
      }),
    [watch]
  );

  const { getPrefectures, prefectures } = usePrefectures();
  const { getOccupations, occupations } = useOccupations();

  const store = {
    control,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
    onSubmit,

    setUser,
    updateAddress,
    prefectures,
    occupations,
    getPrefectures,
    getOccupations
  };

  return store;
};
