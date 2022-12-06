/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

interface Subject {
  id: string;
  name: string;
}

interface Props {
  label: string;
  subjects: Subject[];
}

const SubjectCategory = ({ label, subjects }: Props) => {
  return (
    <div>
      <h2>{label}</h2>
      <ul>
        {subjects.map(subject => {
          return <li key={subject.id}>{subject.name}</li>;
        })}
      </ul>
    </div>
  );
};

export default SubjectCategory;
