function hello(world) {
    console.log('Say hello to', world)
}

setTimeout(() => {
    hello('YOU!')
}, 4000);