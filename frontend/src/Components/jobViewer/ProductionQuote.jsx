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
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";

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
  const context = useContext(AuthContext);
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
        props.quoteOptions && props.quoteOptions?.gainPercentage !== undefined
          ? parseFloat(props.quoteOptions.gainPercentage)
          : 45,
      salesCommission:
        props.quoteOptions && props.quoteOptions?.salesCommission !== undefined
          ? props.quoteOptions.salesCommission
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
  const [useSettings, setSettings] = useState(null);
  const gainPercentage = watch("gainPercentage", 45); // Default value
  const salesCommission = watch("salesCommission", 0); // Default value
  const ivaPercentage = isIvaEnabled ? 21 : 0; // IVA is 0 if disabled

  // Create safe derived pricing settings object
  const pricingSettings = useSettings
    ? {
        gainMin: useSettings["pricing.gain.min"],
        gainMax: useSettings["pricing.gain.max"],
        commissionMin: useSettings["pricing.commission.min"],
        commissionMax: useSettings["pricing.commission.max"],
      }
    : null;

  useEffect(() => {
    const fetchProductType = async () => {
      try {
        const product = await getPrivateElementByID("jobs", props.job);
        if (product.Tipo[0].name === "Libro") {
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

  useEffect(() => {
    if (typeof props.quoteSettings === "function") {
      props.quoteSettings({
        gainPercentage:
          props.quoteOptions !== undefined &&
          props.quoteOptions.gainPercentage !== undefined
            ? parseFloat(props.quoteOptions.gainPercentage)
            : gainPercentage,
        salesCommission:
          props.quoteOptions !== undefined
            ? props.quoteOptions.salesCommission
            : salesCommission,
        ivaPercentage:
          props.quoteOptions !== undefined &&
          props.quoteOptions.ivaPercentage !== undefined
            ? props.quoteOptions.ivaPercentage
            : ivaPercentage,
        isIvaEnabled:
          props.quoteOptions !== undefined &&
          props.quoteOptions.isIvaEnabled !== undefined
            ? props.quoteOptions.isIvaEnabled
            : isIvaEnabled,
        quote: quote,
      });
    }
    // eslint-disable-next-line
  }, [gainPercentage, salesCommission, ivaPercentage, isIvaEnabled]);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setUseLoading(true);
        const settings = await getPrivateElementByID(
          "tenants/settings",
          context.memberships[0].tenant.id
        );
        setSettings(settings);
        props.pricingSettings(settings);
        setUseError(null);
      } catch (error) {
        setUseError(error);
      } finally {
        setUseLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const quote = calculateQuote();

  const failure = (
    <ErrorMessage
      message={useError}
      title="Error"
      action={() => {
        setUseError(null);
      }}
    />
  );

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

  // Block rendering until settings are loaded
  if (useLoading) {
    return loading;
  }

  if (useError !== null) {
    return failure;
  }

  // Don't render main content until pricingSettings is available
  if (!pricingSettings) {
    return loading;
  }

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
                        min: {
                          value: pricingSettings.gainMin,
                          message: `El minimo es ${pricingSettings.gainMin}`,
                        },
                        max: {
                          value: pricingSettings.gainMax,
                          message: `El máximo es ${pricingSettings.gainMax}`,
                        },
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
                  </Grid>

                  <Grid item xs={12} md={12}>
                    <TextField
                      name="salesCommission"
                      label="Comisión Ventas"
                      variant="outlined"
                      {...register("salesCommission", {
                        required: "Este campo es requerido",
                        min: {
                          value: pricingSettings.commissionMin,
                          message: `El mínimo es ${pricingSettings.commissionMin}%`,
                        },
                        max: {
                          value: pricingSettings.commissionMax,
                          message: `El máximo es ${pricingSettings.commissionMax}%`,
                        },
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
                  </Grid>
                </Grid>
              </FormGroup>
            </form>
          </FormControl>
        </Grid>
      </Grid>
    </Container>
  );

  return success;
};

export default ProductionQuote;
