import { Navigate } from 'react-router-dom';
import { useUrnIds } from '../../routeHelpers';
import NdlaFilm from '../FilmFrontpage/NdlaFilmFrontpage';
import MultidisciplinarySubjectArticlePage from '../MultidisciplinarySubject/MultidisciplinarySubjectArticlePage';
import MultidisciplinarySubjectPage from '../MultidisciplinarySubject/MultidisciplinarySubjectPage';
import ToolboxSubjectPage from '../ToolboxSubject/ToolboxSubjectPage';
import SubjectPage from './SubjectPage';

const SubjectRouting = () => {
  const { topicList, subjectType } = useUrnIds();

  if (subjectType === 'standard') {
    return <SubjectPage />;
  } else if (subjectType === 'multiDisciplinary') {
    if (topicList.length === 3) {
      return <MultidisciplinarySubjectArticlePage />;
    }
    return <MultidisciplinarySubjectPage />;
  } else if (subjectType === 'toolbox') {
    return <ToolboxSubjectPage />;
  } else if (subjectType === 'film') {
    return <NdlaFilm />;
  }

  return <Navigate to="/404" replace />;
};

export default SubjectRouting;
