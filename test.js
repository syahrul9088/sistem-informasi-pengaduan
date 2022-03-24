const a = new Date((new Date).toLocaleString("en-US", {
    timeZone: "Asia/Jakarta"
})).toDateString();

console.log(a)