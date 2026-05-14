import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";

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
        props.quoteOptions?.gainPercentage !== undefined
          ? parseFloat(props.quoteOptions.gainPercentage)
          : undefined,
      salesCommission:
        props.quoteOptions?.salesCommission !== undefined
          ? props.quoteOptions.salesCommission
          : undefined,
    },
  });

  const [isIvaEnabled, setIsIvaEnabled] = useState(
    props.quoteOptions?.isIvaEnabled !== undefined
      ? props.quoteOptions.isIvaEnabled
      : true,
  );

  const [useError, setUseError] = useState(null);
  const [useLoading, setUseLoading] = useState(false);
  const [useSettings, setSettings] = useState(null);

  const gainPercentage = watch("gainPercentage", 45);
  const salesCommission = watch("salesCommission", 0);
  const ivaPercentage = isIvaEnabled ? 21 : 0;

  const pricingSettings = useSettings
    ? {
        gainMin: useSettings["pricing.gain.min"],
        gainMax: useSettings["pricing.gain.max"],
        gainDef: useSettings["pricing.gain.def"],
        commissionMin: useSettings["pricing.commission.min"],
        commissionMax: useSettings["pricing.commission.max"],
        commissionDef: useSettings["pricing.commission.def"],
      }
    : null;

  // ✅ FIX: Fetch product type solo una vez. Solo cambia isIvaEnabled
  // si NO hay quoteOptions previas (cotización nueva).
  useEffect(() => {
    const fetchProductType = async () => {
      try {
        const product = await getPrivateElementByID("jobs", props.job);
        if (product.Tipo[0].name === "Libro") {
          // Solo pisar si es cotización nueva (sin quoteOptions)
          if (props.quoteOptions?.isIvaEnabled === undefined) {
            setIsIvaEnabled(false);
          }
        }
      } catch (error) {
        setUseError(error);
      }
    };

    fetchProductType();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.job]);

  // ✅ FIX: Fetch settings solo una vez al montar.
  // props.pricingSettings es una prop-función: no va en deps para evitar
  // re-runs si el padre no la memoiza.
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setUseLoading(true);
        const settings = await getPrivateElementByID(
          "settings",
          context.memberships[0].tenant.id,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ FIX: Setear valores por defecto solo cuando llegan los settings
  // y solo si es cotización nueva.
  useEffect(() => {
    if (!useSettings) return;
    if (props.quoteOptions) return; // cotización existente: no pisar

    const gainDef = useSettings["pricing.gain.def"];
    const commissionDef = useSettings["pricing.commission.def"];

    if (gainDef !== undefined) {
      setValue("gainPercentage", gainDef, {
        shouldValidate: true,
        shouldDirty: false,
      });
    }
    if (commissionDef !== undefined) {
      setValue("salesCommission", commissionDef, {
        shouldValidate: true,
        shouldDirty: false,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [useSettings]);

  const calculateQuote = () => {
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

  // ✅ FIX PRINCIPAL: Usar ref para comparar el quote anterior y evitar
  // llamar props.quoteSettings si los valores no cambiaron realmente.
  // Esto corta el loop infinito: quote es un objeto nuevo cada render,
  // pero solo notificamos al padre cuando los VALORES son distintos.
  const prevQuoteRef = useRef(null);

  useEffect(() => {
    if (typeof props.quoteSettings !== "function") return;

    const quoteChanged =
      !prevQuoteRef.current ||
      prevQuoteRef.current.gain !== quote.gain ||
      prevQuoteRef.current.total !== quote.total ||
      prevQuoteRef.current.iva !== quote.iva ||
      prevQuoteRef.current.salesCommission !== quote.salesCommission ||
      prevQuoteRef.current.utilityPercentage !== quote.utilityPercentage;

    if (!quoteChanged) return;

    prevQuoteRef.current = quote;

    props.quoteSettings({
      gainPercentage:
        props.quoteOptions?.gainPercentage !== undefined
          ? parseFloat(props.quoteOptions.gainPercentage)
          : gainPercentage,
      salesCommission:
        props.quoteOptions?.salesCommission !== undefined
          ? props.quoteOptions.salesCommission
          : salesCommission,
      ivaPercentage:
        props.quoteOptions?.ivaPercentage !== undefined
          ? props.quoteOptions.ivaPercentage
          : ivaPercentage,
      isIvaEnabled:
        props.quoteOptions?.isIvaEnabled !== undefined
          ? props.quoteOptions.isIvaEnabled
          : isIvaEnabled,
      quote,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gainPercentage, salesCommission, ivaPercentage, isIvaEnabled, quote.gain, quote.total, quote.iva, quote.salesCommission, quote.utilityPercentage]);

  // --- UI ---

  if (useLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <Spinner />
      </Box>
    );
  }

  if (useError !== null) {
    return (
      <ErrorMessage
        message={useError}
        title="Error"
        action={() => setUseError(null)}
      />
    );
  }

  if (!pricingSettings) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <Spinner />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ padding: "2rem" }}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <FormControl>
            <form name="gainAndTaxes" onSubmit={handleSubmit(() => {})}>
              <FormGroup>
                <Grid container spacing={0}>
                  <Grid size={{ xs: 12, md: 12 }}>
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
                      inputProps={{ step: "0.01" }}
                      InputProps={{ endAdornment: <span>%</span> }}
                      fullWidth
                    />
                    {errors.gainPercentage && (
                      <FormHelperText error>
                        {errors.gainPercentage.message}
                      </FormHelperText>
                    )}
                  </Grid>
                  <Grid size={{ xs: 12, md: 12 }}>
                    <ListItemNumbers
                      primary={currencyFormat(roundInteger(quote.gain))}
                      secondary={`Utilidad (${quote.utilityPercentage} %)`}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 12 }}>
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
                      inputProps={{ step: "0.01" }}
                      InputProps={{ endAdornment: <span>%</span> }}
                      fullWidth
                    />
                    {errors.salesCommission && (
                      <FormHelperText error>
                        {errors.salesCommission.message}
                      </FormHelperText>
                    )}
                  </Grid>
                  <Grid size={{ xs: 12, md: 12 }}>
                    <ListItemNumbers
                      primary={currencyFormat(roundInteger(quote.salesCommission))}
                      secondary={"Comisión"}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 12 }}>
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
                  <Grid size={{ xs: 12, md: 12 }}>
                    <TextField
                      label="Porcentaje de IVA"
                      variant="outlined"
                      value={ivaPercentage}
                      type="number"
                      disabled
                      InputProps={{ endAdornment: <span>%</span> }}
                      fullWidth
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 12 }}>
                    <ListItemNumbers
                      primary={currencyFormat(roundInteger(quote.iva))}
                      secondary={isIvaEnabled ? "IVA" : "IVA sobre el material"}
                    />
                  </Grid>
                  <Divider />
                  <Grid size={{ xs: 12, md: 12 }}>
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
};

export default ProductionQuote;