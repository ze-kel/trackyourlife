import Page from "@components/Page";
import { verifySettings } from "src/helpers/settingsVerifier";

const TestingPage = () => {
  return (
    <Page>
      <div>test page</div>
      
      <button onClick={verifySettings}> test</button>
    </Page>
  );
};

export default TestingPage;
