import React, { useEffect } from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useWatch } from "react-hook-form";

//Mui Material Imports
import {
  Box,
  Container,
  Typography,
  Checkbox,
  FormControlLabel,
  Divider,
} from "@mui/material";
import { Grid } from "@mui/material";
import {
  FormGroup,
  FormControl,
  FormHelperText,
  TextField,
} from "@mui/material";

// My Components
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import {
  roundCents,
  roundInteger,
} from "../utils/generalData/numbersAndCurrencies";
import Spinner from "../General/Spinner";
import { getPrivateElementByID } from "../customHooks/FetchDataHook";
import ListItemNumbers from "./ListItemNumbers";
import {
  percentBefore,
  currencyFormat,
} from "../utils/generalData/numbersAndCurrencies";

const ProductionQuote = (props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      gainPercentage:
        props.quoteOptions && props.quoteOptions.gainPercentage !== undefined
          ? parseFloat(props.quoteOptions.gainPercentage)
          : 45,
      salesCommission:
        props.quoteOptions && props.quoteOptions.salesComision !== undefined
          ? props.quoteOptions.salesComision
          : 0,
    },
  });

  const [isIvaEnabled, setIsIvaEnabled] = useState(
    props.quoteOptions && props.quoteOptions.isIvaEnabled !== undefined
      ? props.quoteOptions.isIvaEnabled
      : true
  );

  const [useError, setUseError] = useState(null);
  const [useLoading, setUseLoading] = useState(false);

  const gainPercentage = watch("gainPercentage", 45); // Default value
  const salesCommission = watch("salesCommission", 0); // Default value
  const ivaPercentage = isIvaEnabled ? 21 : 0; // IVA is 0 if disabled

  useEffect(() => {
    const fetchProductType = async () => {
      try {
        const product = await getPrivateElementByID("jobs", props.job);
        console.log(product.data);
        if (product.data.Tipo[0].name === "Libro") {
          setIsIvaEnabled(false); // Disable IVA for books
        }
      } catch (error) {
        setUseError(error);
      }
    };

    fetchProductType();
  }, [props.job]);

  const calculateQuote = () => {
    // Sumamos los costos de impresión, terminación y material con la condicion de
    // si el IVA no esta habilitado, se lo cargamos al material.
    const costResume =
      props.costResume.Print +
      props.costResume.Finishing +
      (isIvaEnabled
        ? props.costResume.Stock
        : props.costResume.Stock * (1 + 21 / 100));

    const gain = costResume * (percentBefore(gainPercentage) / 100);
    const salesCommissionValue = (costResume + gain) * (salesCommission / 100);
    const iva = isIvaEnabled
      ? (costResume + salesCommissionValue + gain) * (ivaPercentage / 100)
      : props.costResume.Stock * (21 / 100);
    const total =
      costResume + (isIvaEnabled ? iva : 0) + salesCommissionValue + gain;
    const utilityPercentage = percentBefore(gainPercentage);

    return {
      gain: roundCents(gain),
      utilityPercentage: roundCents(utilityPercentage),
      salesCommission: roundCents(salesCommissionValue),
      iva: roundCents(iva),
      total: roundCents(total),
    };
  };

  const quote = calculateQuote();

  useEffect(() => {
    if (typeof props.quoteSettings === "function") {
      props.quoteSettings({
        gainPercentage:
          props.quoteOptions !== null
            ? parseFloat(props.quoteOptions.gainPercentage)
            : gainPercentage,
        salesCommission:
          props.quoteOptions !== null
            ? props.quoteOptions.salesComision
            : salesCommission,
        ivaPercentage:
          props.quoteOptions !== null &&
          props.quoteOptions.ivaPercentage !== undefined
            ? props.quoteOptions.ivaPercentage
            : ivaPercentage,
        isIvaEnabled:
          props.quoteOptions !== null &&
          props.quoteOptions.isIvaEnabled !== undefined
            ? props.quoteOptions.isIvaEnabled
            : isIvaEnabled,
        quote: quote,
      });
    }
    // eslint-disable-next-line
  }, [gainPercentage, salesCommission, ivaPercentage, isIvaEnabled]);

  const failure = <ErrorMessage message={useError} />;

  const loading = (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Spinner />
    </Box>
  );

  const success = (
    <Container maxWidth="lg" sx={{ padding: "2rem" }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormControl>
            <form name="gainAndTaxes" onSubmit={handleSubmit(() => {})}>
              <FormGroup>
                <Grid container spacing={0}>
                  <Grid item xs={12} md={12}>
                    <TextField
                      name="gainPercentage"
                      label="Porcentaje de utilidad"
                      variant="outlined"
                      {...register("gainPercentage", {
                        required: "Este campo es requerido",
                        min: { value: 20, message: "El mínimo es 20%" },
                        max: { value: 60, message: "El máximo es 60%" },
                      })}
                      type="number"
                      inputProps={{
                        step: "0.01", // Allow two decimal places
                      }}
                      InputProps={{
                        endAdornment: <span>%</span>,
                      }}
                      fullWidth
                    />
                    {errors.gainPercentage && (
                      <FormHelperText error>
                        {errors.gainPercentage.message}
                      </FormHelperText>
                    )}
                  </Grid>
                  <Grid item xs={12} md={12}>
                    <ListItemNumbers
                      primary={currencyFormat(roundInteger(quote.gain))}
                      secondary={`Utilidad (${quote.utilityPercentage} %)`}
                    />
                    {/* <Typography variant="h6" align="right">
                      Ganancia: $ {roundInteger(quote.gain)}
                    </Typography> */}
                  </Grid>

                  <Grid item xs={12} md={12}>
                    <TextField
                      name="salesCommission"
                      label="Comisión Ventas"
                      variant="outlined"
                      {...register("salesCommission", {
                        required: "Este campo es requerido",
                        min: { value: 0, message: "El mínimo es 0%" },
                        max: { value: 8, message: "El máximo es 8%" },
                      })}
                      type="number"
                      inputProps={{
                        step: "0.01", // Allow two decimal places
                      }}
                      InputProps={{
                        endAdornment: <span>%</span>,
                      }}
                      fullWidth
                    />
                    {errors.salesCommission && (
                      <FormHelperText error>
                        {errors.salesCommission.message}
                      </FormHelperText>
                    )}
                  </Grid>
                  <Grid item xs={12} md={12}>
                    <ListItemNumbers
                      primary={currencyFormat(
                        roundInteger(quote.salesCommission)
                      )}
                      secondary={"Comisión"}
                    />
                  </Grid>

                  <Grid item xs={12} md={12}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={isIvaEnabled}
                          onChange={(e) => setIsIvaEnabled(e.target.checked)}
                        />
                      }
                      label="Aplicar IVA"
                    />
                  </Grid>
                  <Grid item xs={12} md={12}>
                    <TextField
                      label="Porcentaje de IVA"
                      variant="outlined"
                      value={ivaPercentage}
                      type="number"
                      disabled
                      InputProps={{
                        endAdornment: <span>%</span>,
                      }}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} md={12}>
                    <ListItemNumbers
                      primary={currencyFormat(roundInteger(quote.iva))}
                      secondary={isIvaEnabled ? "IVA" : "IVA sobre el material"}
                    />
                  </Grid>
                  <Divider />
                  <Grid item xs={12} md={12}>
                    <ListItemNumbers
                      primary={currencyFormat(roundInteger(quote.total))}
                      secondary={"Precio Final"}
                    />
                    {/* <Typography variant="h5" color="info">
                      Precio Final: $ {quote.total}.-
                    </Typography> */}
                  </Grid>
                </Grid>
              </FormGroup>
            </form>
          </FormControl>
        </Grid>
      </Grid>
    </Container>
  );

  return useLoading ? loading : useError !== null ? failure : success;
};

export default ProductionQuote;
