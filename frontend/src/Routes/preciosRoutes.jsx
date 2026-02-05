import { Route } from "react-router-dom";
import MainContainer from "../Components/General/MainContainer";
import FormMaterial from "../Components/Formulario/FormMaterial";
import PricesDataForm from "../Components/Formulario/PricesDataForm";
import FormulaEditor from "../Components/Precioso/FormulaEditor";

export const preciosRoutes = ({ color, variant }) => (
  <>
    <Route path="/precios" element={<MainContainer entity={"precios"} />} />
    <Route
      path="/precios/trash"
      element={<MainContainer entity={"precios/trash"} />}
    />
    <Route
      path="/precios/edit/:id"
      element={
        <FormMaterial
          form={PricesDataForm}
          collection="precios"
          task="edit"
          title="Editar Precio"
          subtitle="Edita los valores, mínimos y entradas de este precio. Se agregará una nueva entrada al historial."
          submitText={"Guardar cambios"}
          color={color}
          variant={variant}
        />
      }
    />
    <Route
      path="/precios/add"
      element={
        <FormMaterial
          form={PricesDataForm}
          collection="precios"
          task="new"
          title="Agregar Precio"
          subtitle="Define un nuevo valor, minimo y entradas para este precio. La categoria seleccionada lo hará disponible para los procesos correspondientes."
          submitText={"Agregar Precio"}
          color={color}
          variant={variant}
        />
      }
    />
    <Route
      path="/precios/copy/:id"
      element={
        <FormMaterial
          form={PricesDataForm}
          collection="precios"
          task="copy"
          title="Copiar Precio"
          subtitle="Define un nuevo precio a partir del precio seleccionado (no incluirá el historial)."
          submitText={"Agregar Precio"}
          color={color}
          variant={variant}
        />
      }
    />
    <Route path="/precios/formula" element={<FormulaEditor />} />
  </>
);
