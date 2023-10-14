import {
  Container,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  CardHeader,
  Typography,
  Button,
  Select,
} from "@mui/material";

const JobDetail = (props) => {
  const job = props.job;

  return (
    <Container>
      <Card>
        <CardHeader
          avatar={
            <Avatar
              sx={{ bgcolor: green[500], minWidth: "fit-content", padding: 1 }}
              variant="rounded"
            >
              {job.Cantidad}
            </Avatar>
          }
          title={job.Nombre}
          subheader={job.Owner.Name + " " + job.Owner.LastName}
        />
      </Card>
    </Container>
  );
};

export default JobDetail;
