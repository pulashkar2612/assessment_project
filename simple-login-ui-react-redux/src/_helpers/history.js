// custom history object to allow navigation outside react components
export const history = {
    navigate: function (arg){
        console.log("arg",arg);
        window.location.href = arg
    },
    location: window.location,
};

export const history1 = {
    navigate: function (arg){
        console.log("arg",arg);
        window.location.href = arg
    },
    location: window.location, 
};

