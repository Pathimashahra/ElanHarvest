
export const FadeUp = (delay) => {
    return{
        hidden:  {
            opacity: 0,
            y: 100,
        },
        visible: {
            opacity: 1,
            y: 0,
            transisation:{
                duration: 1,
                delay: delay,
            },
        },
    };
};

export const FadeLeft = (delay) => {
    return{
        hidden: {
            opacity: 0,
            x: 100,
        },
        visible: {
            opacity: 1,
            x: 0,
            transisation: {
                duration: 1,
                delay: delay,
            },
        },
    };
};

export const FadeRight = (delay) => {
    return{
        hidden:{
            opacity: 0,
            x: -50,
        },
        visible: {
            opacity: 1,
            x: 0,
            transisation: {
                duration: 0.8,
                delay: delay,
            },
        },
    };
};