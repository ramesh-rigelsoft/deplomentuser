import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
const validationSchema = Yup.object().shape({
  productCode: Yup.string().required("Product Code is required"),
  productName: Yup.string().required("Product Name is required"),
  quantity: Yup.number()
    .typeError("Quantity must be a number")
    .positive("Quantity must be greater than 0")
    .required("Quantity is required"),
  unitPrice: Yup.number()
    .typeError("Unit Price must be a number")
    .positive("Unit Price must be greater than 0")
    .required("Unit Price is required"),
  uom: Yup.string().required("Unit of Measure is required"),
  storeLocation: Yup.string().required("Store Location is required"),
});
