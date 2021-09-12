namespace Sutil

type DataSimulation =
    static member Stream (init : unit -> 'T) (f : int -> 'T -> 'T) (delay : int) =
        let mutable dispose : unit -> unit = Unchecked.defaultof<_>
        let mutable tick : int  = 0
        let store = ObservableStore.makeStore init (fun _ -> dispose())
        dispose <- Sutil.DOM.interval (fun _ -> tick <- tick + 1; Store.modify (fun v -> f tick v) store) delay
        store

    static member CountList (min : int, max : int, delay : int) =
        let n = max - min + 1
        DataSimulation.Stream
            (fun () -> [])
            (fun t current ->
                let len = t % n
                if (len = 0) then []
                else current @ [ min + len ]
            )
            delay

    static member Count (min : int, max : int, delay : int) =
        DataSimulation.Stream
            (fun _ -> min)
            (fun _ n -> if n = max then min else n + 1)
            delay

    static member Random (min : float, max : float, delay : int) =
        let next() = min + (max - min) * Interop.random()
        DataSimulation.Stream next (fun _ _ -> next()) delay

    static member Random (min : int, max : int, delay : int) =
        let next() = min + int(System.Math.Round(float(max - min) * Interop.random()))
        DataSimulation.Stream next (fun _ _ -> next()) delay

    static member Random (max:int) =
        DataSimulation.Random(1,max,1000)

    static member Random () =
        DataSimulation.Stream Interop.random (fun _ _ -> Interop.random()) 1000
