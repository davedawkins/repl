import { declare, Record } from "../fable-library.2.3.18/Types.js";
import { record, type, string, tuple, list, lambda, unit } from "../fable-library.2.3.18/Reflection.js";
import { Cmd$$$exec as Cmd$0024$0024$0024exec, Cmd$$$batch as Cmd$0024$0024$0024batch, Cmd$$$none as Cmd$0024$0024$0024none } from "./cmd.js";
import { toConsole, onError as onError$$2 } from "./prelude.js";
import { curry, partialApply, uncurry } from "../fable-library.2.3.18/Util.js";
import { append, ofArray } from "../fable-library.2.3.18/List.js";
import { RingBuffer$00601$$Pop as RingBuffer$002400601$0024$0024Pop, RingBuffer$00601$$Push$$2B595 as RingBuffer$002400601$0024$0024Push$0024$00242B595, RingBuffer$00601$$$$002Ector$$Z524259A4 as RingBuffer$002400601$0024$0024$0024$0024002Ector$0024$0024Z524259A4 } from "./ring.js";
import { value as value$$2, some } from "../fable-library.2.3.18/Option.js";
import { toText, printf } from "../fable-library.2.3.18/String.js";
export const Program$00604 = declare(function Elmish_Program(arg1, arg2, arg3, arg4, arg5, arg6, arg7) {
  this.init = arg1;
  this.update = arg2;
  this.subscribe = arg3;
  this.view = arg4;
  this.setState = arg5;
  this.onError = arg6;
  this.syncDispatch = arg7;
}, Record);
export function Program$00604$reflection($gen$$5, $gen$$6, $gen$$7, $gen$$8) {
  return record("Elmish.Program`4", [$gen$$5, $gen$$6, $gen$$7, $gen$$8], Program$00604, () => [["init", lambda($gen$$5, tuple($gen$$6, list(lambda(lambda($gen$$7, unit), unit))))], ["update", lambda($gen$$7, lambda($gen$$6, tuple($gen$$6, list(lambda(lambda($gen$$7, unit), unit)))))], ["subscribe", lambda($gen$$6, list(lambda(lambda($gen$$7, unit), unit)))], ["view", lambda($gen$$6, lambda(lambda($gen$$7, unit), $gen$$8))], ["setState", lambda($gen$$6, lambda(lambda($gen$$7, unit), unit))], ["onError", lambda(tuple(string, type("System.Exception")), unit)], ["syncDispatch", lambda(lambda($gen$$7, unit), lambda($gen$$7, unit))]]);
}
export function ProgramModule$$$mkProgram(init, update, view) {
  return new Program$00604(init, update, function (_arg1) {
    return Cmd$0024$0024$0024none();
  }, view, function setState(model, $arg$$1) {
    view(model, $arg$$1), null;
  }, function (tupledArg) {
    onError$$2(tupledArg[0], tupledArg[1]);
  }, uncurry(2, function (x) {
    return x;
  }));
}
export function ProgramModule$$$mkSimple(init$$1, update$$1, view$$1) {
  return new Program$00604(function init$$2($arg$$2) {
    return [init$$1($arg$$2), Cmd$0024$0024$0024none()];
  }, function update$$2(msg, $arg$$3) {
    return [update$$1(msg, $arg$$3), Cmd$0024$0024$0024none()];
  }, function (_arg1$$1) {
    return Cmd$0024$0024$0024none();
  }, view$$1, function setState$$1(model$$1, $arg$$4) {
    view$$1(model$$1, $arg$$4), null;
  }, function (tupledArg$$1) {
    onError$$2(tupledArg$$1[0], tupledArg$$1[1]);
  }, uncurry(2, function (x$$1) {
    return x$$1;
  }));
}
export function ProgramModule$$$withSubscription(subscribe, program) {
  const sub = function sub(model$$2) {
    return Cmd$0024$0024$0024batch(ofArray([program.subscribe(model$$2), subscribe(model$$2)]));
  };

  return new Program$00604(program.init, program.update, sub, program.view, program.setState, program.onError, program.syncDispatch);
}
export function ProgramModule$$$withConsoleTrace(program$$1) {
  const traceInit = function traceInit(arg) {
    const patternInput = program$$1.init(arg);
    toConsole("Initial state:", patternInput[0]);
    return [patternInput[0], patternInput[1]];
  };

  const traceUpdate = function traceUpdate(msg$$1, model$$3) {
    toConsole("New message:", msg$$1);
    const patternInput$$1 = program$$1.update(msg$$1, model$$3);
    toConsole("Updated state:", patternInput$$1[0]);
    return [patternInput$$1[0], patternInput$$1[1]];
  };

  return new Program$00604(traceInit, traceUpdate, program$$1.subscribe, program$$1.view, program$$1.setState, program$$1.onError, program$$1.syncDispatch);
}
export function ProgramModule$$$withTrace(trace, program$$2) {
  return new Program$00604(program$$2.init, function update$$3(msg$$2, model$$4) {
    trace(msg$$2, model$$4);
    return program$$2.update(msg$$2, model$$4);
  }, program$$2.subscribe, program$$2.view, program$$2.setState, program$$2.onError, program$$2.syncDispatch);
}
export function ProgramModule$$$withErrorHandler(onError, program$$3) {
  return new Program$00604(program$$3.init, program$$3.update, program$$3.subscribe, program$$3.view, program$$3.setState, onError, program$$3.syncDispatch);
}
export function ProgramModule$$$mapErrorHandler(map, program$$4) {
  return new Program$00604(program$$4.init, program$$4.update, program$$4.subscribe, program$$4.view, program$$4.setState, partialApply(1, map, [program$$4.onError]), program$$4.syncDispatch);
}
export function ProgramModule$$$withSetState(setState$$2, program$$5) {
  return new Program$00604(program$$5.init, program$$5.update, program$$5.subscribe, program$$5.view, setState$$2, program$$5.onError, program$$5.syncDispatch);
}
export function ProgramModule$$$setState(program$$6) {
  return curry(2, program$$6.setState);
}
export function ProgramModule$$$view(program$$7) {
  return curry(2, program$$7.view);
}
export function ProgramModule$$$withSyncDispatch(syncDispatch, program$$8) {
  return new Program$00604(program$$8.init, program$$8.update, program$$8.subscribe, program$$8.view, program$$8.setState, program$$8.onError, syncDispatch);
}
export function ProgramModule$$$map(mapInit, mapUpdate, mapView, mapSetState, mapSubscribe, program$$9) {
  return new Program$00604(partialApply(1, mapInit, [program$$9.init]), uncurry(2, partialApply(2, mapUpdate, [program$$9.update])), partialApply(1, mapSubscribe, [program$$9.subscribe]), uncurry(2, partialApply(2, mapView, [program$$9.view])), uncurry(2, partialApply(2, mapSetState, [program$$9.setState])), program$$9.onError, uncurry(2, function (x$$2) {
    return x$$2;
  }));
}
export function ProgramModule$$$runWith(arg$$1, program$$10) {
  const patternInput$$2 = program$$10.init(arg$$1);
  const rb = RingBuffer$002400601$0024$0024$0024$0024002Ector$0024$0024Z524259A4(10);
  let reentered = false;
  let state$$2 = patternInput$$2[0];

  const dispatch = function dispatch(msg$$3) {
    if (reentered) {
      RingBuffer$002400601$0024$0024Push$0024$00242B595(rb, msg$$3);
    } else {
      reentered = true;
      let nextMsg = some(msg$$3);

      while (nextMsg != null) {
        const msg$$4 = value$$2(nextMsg);

        try {
          const patternInput$$3 = program$$10.update(msg$$4, state$$2);
          program$$10.setState(patternInput$$3[0], syncDispatch$$1);
          Cmd$0024$0024$0024exec(syncDispatch$$1, patternInput$$3[1]);
          state$$2 = patternInput$$3[0];
        } catch (ex$$2) {
          program$$10.onError([toText(printf("Unable to process the message: %A"))(msg$$4), ex$$2]);
        }

        nextMsg = RingBuffer$002400601$0024$0024Pop(rb);
      }

      reentered = false;
    }
  };

  const syncDispatch$$1 = partialApply(1, program$$10.syncDispatch, [dispatch]);
  program$$10.setState(patternInput$$2[0], syncDispatch$$1);
  let sub$$1;

  try {
    sub$$1 = program$$10.subscribe(patternInput$$2[0]);
  } catch (ex$$3) {
    program$$10.onError(["Unable to subscribe:", ex$$3]);
    sub$$1 = Cmd$0024$0024$0024none();
  }

  Cmd$0024$0024$0024exec(syncDispatch$$1, append(sub$$1, patternInput$$2[1]));
}
export function ProgramModule$$$run(program$$11) {
  ProgramModule$$$runWith(null, program$$11);
}
