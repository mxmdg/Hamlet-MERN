import Fetch from "../General/Fetch";

const JobsContainer = (props) => {
  return (
    <>
      <Fetch collection={props.entity} />
    </>
  );
};

export default JobsContainer;
