
export function random(len: number): string {
    let options = "hbfcuerwhufhwiuwifnhwrvnhthu8w4683jfmjkclkenfuewui733278y3481u9y32";
    let length = options.length;
    let ans = "";

    for(let i = 0; i < len; i++) {
        ans += options[Math.floor(Math.random() * length)];
    }

    return ans;
} 