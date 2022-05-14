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
import type { Customer } from 'src/models/customer';

import type { FormInputType } from './types';

export const useCustomerFormState = (userId?: number) => {
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

  const setCustomer = useCallback((customer?: Customer) => {
    if (Boolean(customer)) {
      setValue('familyName', customer.familyName);
      setValue('givenName', customer.givenName);
      setValue('familyNameKana', customer.familyNameKana);
      setValue('givenNameKana', customer.givenNameKana);
      setValue('postalCode', customer.postalCode);
      setValue('prefecture', customer.prefecture);
      setValue('address1', customer.address1);
      setValue('address2', customer.address2);
      setValue('address3', customer.address3);
      setValue('phoneNumber', customer.phoneNumber);
      setValue('homePhoneNumber', customer.homePhoneNumber);
      setValue('email', customer.email);
      setValue('gender', customer.gender);
      setValue('birthday', customer.birthday);
      setValue('occupation', customer.occupation);
      setValue('firstVisitDate', customer.firstVisitDate);
      setValue('memo', customer.memo ? customer.memo : '');
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

    setCustomer,
    updateAddress,
    prefectures,
    occupations,
    getPrefectures,
    getOccupations
  };

  return store;
};
