import React, { ReactNode, useState } from 'react';

export enum ElementType {
    button1x1,
    button1x2,
    button2x1,
    screen2x1,
    screen2x2,
    screen3x2,
}

export type Element = {
    id: number,
    x: number,
    y: number,
}

export type Coordinates = {
    x: number,
    y: number,
}

export type Hitbox = {
    sectors: number[],
    w: number,
    h: number,
}

export type SectorType = {
    element: Element,
    selected: boolean,
}

type DraggableButton = {
    state: 'idle' | 'moving' | 'released',
    type: ElementType | undefined,
    location: Coordinates | undefined,                  //as próprias coordenadas X, Y e o ID do botão sendo movido.
    initial?: Coordinates,                              //as coordenadas iniciais do movimento (opcionais).
    sectors: SectorType[],                          //as coordenas X, Y e o ID do setor por onde o botão foi arrastado por último
    hitbox: Hitbox | undefined,
    trashed: boolean,
}

export type PositionedElement = {
    type: ElementType,
    backgroundColor: string,
    borderColor: string,
    command: string,
    X: number,
    Y: number,
    text: string,
    textColor: string,
    hitboxRatio: number[],
    width: number,
    height: number,
    sectorsOccupied: number[],
}

type LocalContext = {
    floatingButton: DraggableButton,
    buttons: PositionedElement[],
    setFloatingButton: React.Dispatch<React.SetStateAction<DraggableButton>>
    setButtons: React.Dispatch<React.SetStateAction<PositionedElement[]>>
}

export const numberOfButtons = 32;
export const numberOfCollumns = 8;
export const margin = 4;
export const sectors = [...Array(numberOfButtons)].map((x, i) => (i));

const initialSectors: SectorType[] = sectors.map(id => ({
    selected: false,
    element: {
        id: id,
        x: -1,
        y: -1,
    }
}));

const initialDraggableButton: DraggableButton = {
    state: 'idle', 
    location: {
        x: -1,
        y: -1,
    }, 
    sectors: initialSectors,
    type: undefined,
    hitbox: undefined,
    trashed: false,
};

const initialContext:LocalContext = {
    floatingButton: initialDraggableButton,
    buttons: [],
    setFloatingButton: () => null,
    setButtons: () => null,
}

interface EditProviderProps {
    children: ReactNode;
}  

const EditContext = React.createContext<LocalContext>(initialContext);

export function useEditContext(){
    return React.useContext(EditContext);
}

export default function EditProvider(props: EditProviderProps){
    const [floatingButton, setFloatingButton] = useState<DraggableButton>(initialDraggableButton);
    const [buttons, setButtons] = useState<PositionedElement[]>([]);
    const { children } = props;

    const context: LocalContext = {
        floatingButton,
        buttons,
        setFloatingButton,
        setButtons,
    }

return (
    <EditContext.Provider value={context}>
        {children}
    </EditContext.Provider>
    )
}