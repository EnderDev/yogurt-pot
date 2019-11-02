const testing = (hello, number) => {
  console.log(hello);

  const times = number;
  for (var i = 0; i < times; i++) {
    console.log('This is the number', i);
  }
};

testing('Hola!', 10);
