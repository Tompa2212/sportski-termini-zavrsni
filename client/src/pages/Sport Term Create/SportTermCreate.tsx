import { useRef } from 'react';
import styled from 'styled-components';
import { AutoField, AutoForm } from 'uniforms-unstyled';
import { SubmitField } from '../../components/FormFields/SubmitField';
import { useExecuteAction } from '../../hooks/useExecuteAction';
import { bridge } from '../../schema/bridge';
import { createTermSchema } from '../../schema/createTermSchema';
import { createSportTermLayout } from '../../schema/createTermSchema';
import { appRequestLinks } from '../../utils/appLinks';

const schema = bridge(createTermSchema);
const initialModel = {
  teamGame: false,
  playersPerTeam: 1,
};

const sportTermsHref = appRequestLinks.sportTerms;

export const SportTermCreate = () => {
  const executeAction = useExecuteAction();
  const formRef = useRef<any>(null);

  const onSubmit = async (model: Record<string, any>) => {
    const formData = { ...model, sport: model.sport.value };

    await executeAction({
      link: { href: sportTermsHref, type: 'POST' },
      body: formData,
      onComplete: () => formRef.current.reset(),
    });
  };

  return (
    <main>
      <h1>Kreirajte i objavite sportski termin</h1>
      <section>
        <AutoForm
          onSubmit={onSubmit}
          schema={schema}
          model={initialModel}
          ref={(ref) => (formRef.current = ref)}
          onChangeModel={(model) => {}}
        >
          <Wrapper>
            {createSportTermLayout.map((fieldGroup, index) => {
              return (
                <div className="field-group" key={index}>
                  <h3>{fieldGroup.fieldGroup}</h3>
                  <div className="field-item">
                    {fieldGroup.fields.map((field) => {
                      return (
                        <AutoField
                          name={field.name}
                          label={field.label}
                          key={field.name}
                        />
                      );
                    })}
                  </div>
                </div>
              );
            })}
            <SubmitField className="btn" title="Objavi" />
            <button
              className="btn btn--white"
              style={{ marginLeft: '1.2rem' }}
              onClick={() => formRef.current.reset()}
            >
              Odustani
            </button>
          </Wrapper>
        </AutoForm>
      </section>
    </main>
  );
};

const Wrapper = styled.div`
  padding-bottom: 2rem;

  .field-group {
    h3 {
      font-size: 1.4rem;
      margin-bottom: 1rem;
    }

    .field-item {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      column-gap: 1.5rem;
    }
  }
`;
