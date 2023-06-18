import React from 'react';
import {data} from '../server'
import { timeAgo } from '../server';
import { Note, Exercise, Person, Lesson as Lesson2 } from '../db/converter';
import {Account} from '../interfaces'
import iconmapper from '../utils/iconmapper';


type Lesson = Omit<Lesson2, keyof { id: unknown}>;
const mi = iconmapper;
const persons = data.persons;



interface TimeAgo {
  format: (date: number) => string;
}

export interface NoteViewProps {
  url: string;
  account: Account | null;
  mi: (icon: string) => string;
  lesson: Lesson;
  persons: Person[];
  timeAgo: TimeAgo;
  selectedNote: Note
  renderedContent: string;
}

const Header: React.FC<{ mi: (icon: string) => string, account: Account | null}> = ({ mi, account }) => {
  return (
    <div className="header">
      <span title-large>
        <a className="no-decoration" href="../../">
          <span className="MDI">{mi('arrow-left')}</span>
        </a>
        Podgląd lekcji
      </span>

      <div className="right-group">
        <span title-small>
          Zalogowano jako
          <b style={{ color: 'var(--md-sys-color-primary)' }}>{account?.name}</b>
        </span>
        <span className="MDI" title="Pomoc" headline-small>
          {mi('help-circle-outline')}
        </span>
      </div>
    </div>
  );
};

const LeftSide: React.FC<{ mi: (icon: string) => string, lesson: Lesson, persons: Person[], timeAgo: TimeAgo }> = ({ mi, lesson, persons, timeAgo }) => {
  const addNote = () => {
    document.location = '../add/note';
  };

  const addExercise = () => {
    document.location = '../add/exercise';
  };

  function search() {

    window.location.href = "/search?q=" + "";
  }

  return (
    <div className="leftside-wrapper">
      <div className="search-wrapper">
        <input
          type="text"
          id="input"
          placeholder="Szukaj"
          onKeyPress={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              document.getElementById('search')!.click();
            }
          }}
        />
        <button id="search" onClick={search} className="MDI">
          {mi('magnify')}
        </button>
      </div>
      <div className="lesson">
        <span headline-medium>{lesson.topic}</span>
        <div className="details">
          <span title-medium>{lesson.realStartDate}</span>
          <span className="timeandauthor" title-small>
            Dodane {timeAgo.format(lesson.updateDate * 1000)} przez {persons[lesson.addedBy].name}
          </span>
        </div>
        <div className="wrapper contents">
          <div className="inline-flex" style={{ gap: 8, margin: 4 }}>
            <button className="outline" onClick={addNote}>
              <span className="MDI">{mi('file-document-plus-outline')}</span>
              Dodaj notatke
            </button>
            <button className="outline" onClick={addExercise}>
              <span className="MDI">{mi('shape-plus')}</span>
              Dodaj zadanie
            </button>
          </div>
          <div className="contents">
            {lesson.notes.map((note, i) => (
              <div className="content" key={i}>
                <div className="icon-wrapper">
                  <a href={`../../n/${i}`} className="MDI no-decoration" title-large>
                    {mi('file-document-outline')}
                  </a>
                </div>
                <div className="right">
                  <span className="timeandauthor" label-medium>
                    Dodane {timeAgo.format(note.updateDate * 1000)} przez {persons[note.addedBy].name}
                  </span>
                  <span className="realdate" title-medium>
                    {note.realDate}
                  </span>
                </div>
                <div className="icon-wrapper teritary">
                  <a href={`../../edit/note/${i}`} className="MDI no-decoration" title-large>
                    {mi('pencil')}
                  </a>
                </div>
              </div>
            ))}
            {lesson.exercises.map((exercise, i) => (
              <div className="content" key={i}>
                <div className="icon-wrapper">
                  <a href={`../../e/${i}`} className="MDI no-decoration" title-large>
                    {mi('shape')}
                  </a>
                </div>
                <div className="right">
                  <span className="timeandauthor" label-medium>
                    Dodane {timeAgo.format(exercise.updateDate * 1000)} przez {persons[exercise.addedBy].name}
                  </span>
                  <span className="realdate" title-medium>
                    {exercise.reference}
                  </span>
                </div>
                <div className="icon-wrapper teritary">
                  <a href={`../../edit/exercise/${i}`} className="MDI no-decoration" title-large>
                    {mi('pencil')}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const RightSide: React.FC<{ selectedNote: Note, renderedContent: string }> = ({ selectedNote, renderedContent }) => {
  return (
    <div className="rightside-wrapper">
      <div className="note-info">
        <span title-large>{selectedNote.realDate}</span>
        <span label-medium className="note-details">
          Napisane przez {persons[selectedNote.addedBy].name} {timeAgo.format(selectedNote.updateDate * 1000)}
        </span>
      </div>
      <span className="title" label-large>
        <span className="MDI" body-large>
          {mi('file-document-outline')}
        </span>
        Zawartość notatki
      </span>
      <div id="rightside-content">
        <div dangerouslySetInnerHTML={{ __html: renderedContent }}></div>
      </div>
    </div>
  );
};

const MyComponent: React.FC<NoteViewProps> = (props) => {
  return (
    <html lang="pl">
      <head>
        <link rel="stylesheet" href={`${props.url}static/katex/katex.min.css`} />
        <link rel="stylesheet" href={`${props.url}static/mainstyles.css`} />
        <link rel="stylesheet" href={`${props.url}static/lessonstyle.css`} />
        <link rel="icon" type="image/x-icon" href={`${props.url}static/favicon.ico`} />
        <title>Edytor</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style></style>
      </head>
      <body>
        <Header mi={props.mi} account={props.account} />
        <div className="main">
          <LeftSide
            mi={props.mi}
            lesson={props.lesson}
            persons={props.persons}
            timeAgo={props.timeAgo}
          />
          <RightSide selectedNote={props.selectedNote} renderedContent={props.renderedContent} />
        </div>
      </body>
    </html>
  );
};

export default MyComponent;
