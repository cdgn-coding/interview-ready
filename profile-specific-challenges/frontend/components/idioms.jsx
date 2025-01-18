/*
  The exercise is meant to test code fluency, understanding of react idioms, and communication.
  To solve, rewrite the snippet of code to a better version and a description of why the code is improved.

  Submit a fork or a PR to gabriel@silver.dev for feedback and corrections.

  Some references used:
  https://claritydev.net/blog/the-most-common-mistakes-when-using-react
*/
import { useCallback, useEffect, useRef, useState } from "react";
import { API } from "../api";

const Button = ({ buttonText }) => {
  return <button>{buttonText}</button>;
};
export function FunctionsAsComponents({ buttonText = "Start Now" }) {

  return <div><Button buttonText={buttonText}/></div>;
}

export function deepCopyObject(obj) {
  if (typeof obj === 'undefined' || obj === null) {
    return obj;
  }

  if (typeof obj !== 'object') {
    return obj;
  }

  if (obj instanceof Array) {
    return obj.map(deepCopyObject);
  }

  if (obj instanceof Map) {
    const cp = new Map();
    for (const [key, value] of obj) {
      cp.set(key, deepCopyObject(value));
    }
    return cp;
  }

  const cp = {}

  for (const key in obj) {
    cp[key] = deepCopyObject(obj[key]);
  }

  return cp;
}

export function deepCopyArray(array) {
  return array.map(deepCopyObject);
}

export function UseEffectThrashing({ frequentlyChangedURL }) {
  const [signal, setSignal] = useState(null)
  useEffect(() => {
    if (signal) {
      signal.abort()
    }

    const s = new AbortController()
    setSignal(s)
    
    const fetchData = async () => {
      await fetch(frequentlyChangedURL, { signal: s });
    };

    fetchData();
  }, [frequentlyChangedURL]);

  return <div></div>;
}

export function UseEffectDerivedCalculation() {
  const [clickedTimes, setClickedTimes] = useState(0);

  const handleClick = useCallback(() => setClickedTimes(clickedTimes + 1), [clickedTimes]);

  return (
    <div>
      <button onClick={handleClick}>Add Click Count</button>
      <span>Sum: {clickedTimes}</span>
      <span>Remainder: {clickedTimes % 5}</span>
    </div>
  );
}

export function UseStateDerivedCalculation() {
  const [clickedTimes, setClickedTimes] = useState(0);
  const remainder = clickedTimes % 5;
  const handleClick = () => {
    setClickedTimes(clickedTimes + 1);
  };

  return (
    <div>
      <button onClick={handleClick}>Add Click Count</button>
      <span>Sum: {clickedTimes}</span>
      <span>Remainder: {remainder}</span>
    </div>
  );
}

export function DirtyUnmount() {
  const [time, setTime] = useState(0);

  useEffect(() => {
    const it = setInterval(() => {
      setTime((t) => t + 1);
    }, 1000);

    return () => clearInterval(it)
  }, []);

  return <div>Clock in seconds: {time}</div>;
}

export function AvoidingUseState() {
  return <div>{"Mounted"}</div>;
}

export function UnrenderableState() {
  const [result, setResult] = useState();
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const result = await API.unrenderableState();
        setResult(result);
      } catch(error) {
        setErr(error)
      }
        setLoading(false)
    };

    fetchData();
  }, []);

  return (
    <div>
      <span>Loading: {loading ? "Pending": "Done"}</span>
      Result: {result}
    </div>
  );
}

const defaultCalendarDays = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
  22, 23, 24, 25, 26, 27, 28, 29, 30,
]

export function CrudeDeclarations({ calendarDays = defaultCalendarDays }) {
  return (
    <ol>
      {calendarDays.map((val) => (
        <li key={val}>{val}</li>
      ))}
    </ol>
  );
}

export function AvoidMagicNumbers(age) {
  const isAdult = age >= 18;
  return (
    <ol>{isAdult ? <div>Spicy</div> : <div>You are not old enough</div>}</ol>
  );
}

export function UnidiomaticHTMLStructure() {
  const [name, setName] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault()
    // do stuff
  };

  const handleChange = (e) => setName(e.target.value);

  return (
    <div>
      <form onSubmit={handleSubmit}>
          <input value={name} name="name" type="text" onChange={handleChange} id="name"/>
          <label htmlFor="name"></label>
        <button type="submit" onClick={handleSubmit}>
          Submit
        </button>
      </form>
    </div>
  );
}

export function CrudeStateManagement() {
  const [formState, setFormState] = useState({
    name: "",
    age: "",
    location: "",
    email: "",
    password: "",
  })

  const {
    name,
    age,
    location,
    email,
    password,
  } = formState;

  const setField = fieldName => e => {
    const value = e.target.value;
    setFormState( state => {
      cp = { ...state };
      cp[fieldName] = value;
      return value;
    })
  }

  const handleSubmit = (e) => {};

  const setName = setField('name')
  const setAge = setField('age')
  const setEmail = setField('email')
  const setPassword = setField('password')
  const setLocation = setField('location')

  return (
    <form onSubmit={handleSubmit}>
      <input value={name} name="name" type="text" onChange={setName} />
      <input value={age} name="age" type="number" onChange={setAge} />
      <input
        value={location}
        name="location"
        type="text"
        onChange={setLocation}
      />
      <input value={email} name="email" type="email" onChange={setEmail} />
      <input
        value={password}
        name="password"
        type="password"
        onChange={setPassword}
      />
      <button type="submit">Submit</button>
    </form>
  );
}

export function UnidiomaticHTMLHierarchy() {
  const bids = [1, 2, 3];
  const asks = [1, 2, 3];

  return (
    <>
      <ul>
        {bids.map((bid, i) => (
          <li key={i}>{bid}</li>
        ))}
      </ul>
      <ul>
        {asks.map((ask, j) => (
          <li key={j + "asks"}>{ask}</li>
        ))}
      </ul>
    </>
  );
}

export function SubstandardDataStructure() {
  const [errors, setErrors] = useState([]);

  const addError = error => setErrors(errors => [...errors, error]);
  const crearErrors = () => setErrors([])

  return (
    <div>
      <button onClick={() => addError("Error A")}>Throw Error A</button>
      <button onClick={() => addError("Error B")}>Throw Error B</button>
      <button onClick={crearErrors}>Clear Errors</button>
      <div>
        <ul>
          {errors.map((error, i) =>
            <li key={`${i}-error`}>{error}</li>
          )}
        </ul>
      </div>
    </div>
  );
}

export function DangerousIdentifier() {
  const [people, setPeople] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Get the input value directly from the form
    const formData = new FormData(e.target);
    const personName = formData.get("name").trim();

    if (!personName) {
      console.error("Name cannot be empty");
      return;
    }

    const record = {
      name: personName,
      id: Math.random().toString(), // Avoid using Math.random for IDs in production
    };

    setPeople((ppl) => [...ppl, record]);

    // Clear the input field
    e.target.reset();
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" id="name" />
        <label htmlFor="name"></label>
        <button type="submit">Add Person</button>
      </form>
      <ul>
        {people.map((person) => (
          <li key={person.id}>{person.name}</li>
        ))}
      </ul>
    </div>
  );
}

//
export function IncorrectDependencies({ records }) {
  useEffect(() => {
    API.trackView(records);
  }, [records]);

  return (
    <div>
      {records.map((record) => (
        <div key={record.id} id={record.id}>
          {record.name}
        </div>
      ))}
    </div>
  );
}

export function UnnecessaryFunctionRedefinitions(emails) {
  const validateEmail = (email) => email.includes("@");

  return (
    <div>
      {emails.map((email) => (
        <div key={email}>
          {email} is {validateEmail(email) ? "Valid" : "Invalid"}
        </div>
      ))}
    </div>
  );
}

// Hint: part of the rendering structure is re-rendered frequently unnecessarily
export function UnoptimizableRenderingStructure({ altRecords }) {
  const [liveRecords, setLiveRecords] = useState([]);
  const renders = useRef(1);

  useEffect(() => {
    async function loadRecords() {
      const interval = setInterval(async () => {
        const recs = await API.fetchRecords();
        setLiveRecords(recs);
      }, 5000);

      return () => clearInterval(interval);
    }
    loadRecords();
  }, []);

  return (
    <div>
      <ul>
        {liveRecords.map((rec) => (
          <li key={rec.id}>{rec.id}</li>
        ))}
      </ul>
      Renders: {renders.current++}
      <ul>
        {altRecords.map((rec) => (
          <li key={rec.id}>{rec.id}</li>
        ))}
      </ul>
    </div>
  );
}

// Render Hooks

function useRenderHook(number) {
  return <div>{number}</div>;
}

export function RenderHookComponent() {
  const [counter, setCounter] = useState();
  const number = useRenderHook(counter);

  return (
    <div>
      <button onClick={() => setCounter((n) => n + 1)}>Click up</button>
      {number}
    </div>
  );
}

// Avoid Prop Drilling

function Child3({ counter } = { counter: number }) {
  <div>{counter}</div>;
}
function Child2({ counter } = { counter: number }) {
  <Child3 counter={counter} />;
}
function Child({ counter } = { counter: number }) {
  <Child2 counter={counter} />;
}
function ExcessivePropDrilling() {
  return <Child counter={5} />;
}

function untestableRegex(email) {
  // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/email
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(email);
}

// How does it compare to crypto.randomUUID()?
function unstableUniqueIdGenerator() {
  return Math.floor(Math.random() * 10000);
}
