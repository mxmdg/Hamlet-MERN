import { useForm, Controller } from "react-hook-form";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import SmartMeasureInput from "../../Formulario/SmartMeasureInput";

// ---------------------------------------------------------------------------
// Los 5 campos (actualX, actualY, factor, scaledX, scaledY) están ligados por:
//   scaledX = actualX * factor
//   scaledY = actualY * factor
//
// Cualquiera de los 5 se puede editar. Al tocar uno, despejamos los que
// dependen de él y los actualizamos con setValue (esto NO re-dispara el
// onChange de esos campos, así que no hay loops):
//
//   factor  editado -> scaledX = actualX*factor ; scaledY = actualY*factor
//   actualX editado -> scaledX = actualX*factor   (Y no se toca)
//   actualY editado -> scaledY = actualY*factor   (X no se toca)
//   scaledX editado -> factor = scaledX/actualX  ; scaledY = actualY*factor
//   scaledY editado -> factor = scaledY/actualY  ; scaledX = actualX*factor
// ---------------------------------------------------------------------------

export const ScaleCalculator = (props) => {
  const variant = props.variant || "outlined";
  const color = props.color || "primary";

  const { control, getValues, setValue } = useForm({
    defaultValues: { actualX: 0, actualY: 0, factor: 1, scaledX: 0, scaledY: 0 },
  });

  const num = (v) => parseFloat(v) || 0;

  const onActualXChange = (val) => {
    const ax = num(val);
    const f = num(getValues("factor"));
    setValue("scaledX", +(ax * f).toFixed(4));
  };

  const onActualYChange = (val) => {
    const ay = num(val);
    const f = num(getValues("factor"));
    setValue("scaledY", +(ay * f).toFixed(4));
  };

  const onFactorChange = (val) => {
    const f = num(val);
    const ax = num(getValues("actualX"));
    const ay = num(getValues("actualY"));
    setValue("scaledX", +(ax * f).toFixed(4));
    setValue("scaledY", +(ay * f).toFixed(4));
  };

  const onScaledXChange = (val) => {
    const sx = num(val);
    const ax = num(getValues("actualX"));
    const ay = num(getValues("actualY"));
    if (ax === 0) return; // no hay de dónde despejar el factor
    const f = sx / ax;
    setValue("factor", +f.toFixed(6));
    setValue("scaledY", +(ay * f).toFixed(4));
  };

  const onScaledYChange = (val) => {
    const sy = num(val);
    const ax = num(getValues("actualX"));
    const ay = num(getValues("actualY"));
    if (ay === 0) return;
    const f = sy / ay;
    setValue("factor", +f.toFixed(6));
    setValue("scaledX", +(ax * f).toFixed(4));
  };

  return (
    <Container>
      <Box sx={{ mt: 4 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="overline" color="text.secondary">
              Medida actual
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="overline" color="text.secondary">
              Medida escalada
            </Typography>
          </Grid>

          <Grid size={{ xs: 6, sm: 3 }}>
            <Controller
              name="actualX"
              control={control}
              render={({ field: { onChange, value } }) => (
                <SmartMeasureInput
                  id="actualX"
                  variant={variant}
                  color={color}
                  subtype="length"
                  label="X Actual"
                  value={value ?? ""}
                  onChange={(val) => {
                    onChange(val);
                    onActualXChange(val);
                  }}
                />
              )}
            />
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <Controller
              name="actualY"
              control={control}
              render={({ field: { onChange, value } }) => (
                <SmartMeasureInput
                  id="actualY"
                  variant={variant}
                  color={color}
                  subtype="length"
                  label="Y Actual"
                  value={value ?? ""}
                  onChange={(val) => {
                    onChange(val);
                    onActualYChange(val);
                  }}
                />
              )}
            />
          </Grid>

          <Grid size={{ xs: 6, sm: 3 }}>
            <Controller
              name="scaledX"
              control={control}
              render={({ field: { onChange, value } }) => (
                <SmartMeasureInput
                  id="scaledX"
                  variant={variant}
                  color={color}
                  subtype="length"
                  label="X Escalado"
                  value={value ?? ""}
                  onChange={(val) => {
                    onChange(val);
                    onScaledXChange(val);
                  }}
                />
              )}
            />
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <Controller
              name="scaledY"
              control={control}
              render={({ field: { onChange, value } }) => (
                <SmartMeasureInput
                  id="scaledY"
                  variant={variant}
                  color={color}
                  subtype="length"
                  label="Y Escalado"
                  value={value ?? ""}
                  onChange={(val) => {
                    onChange(val);
                    onScaledYChange(val);
                  }}
                />
              )}
            />
          </Grid>

          <Grid size={12}>
            <Divider sx={{ my: 1 }} />
          </Grid>

          <Grid size={{ xs: 12, sm: 4 }}>
            <Controller
              name="factor"
              control={control}
              render={({ field: { onChange, value } }) => (
                <SmartMeasureInput
                  id="factor"
                  variant={variant}
                  color={color}
                  label="Factor de Escala"
                  value={value ?? ""}
                  onChange={(val) => {
                    onChange(val);
                    onFactorChange(val);
                  }}
                />
              )}
            />
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};
