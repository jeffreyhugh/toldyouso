# [told-you.so](https://told-you.so)
a prediction time capsule 🔮

---

## [visit](https://told-you.so) · [about](https://told-you.so/about) · [donate](https://patreon.com/queuebot)

If you want to spin up your own instance, it's easiest to use [Vercel](https://vercel.com) to get the frontend going. 

The backend is a little more complicated, requiring a PostgreSQL server and a host capable of running Go. Once you get those two up, from the project root
```bash
cd backend
go build main.go
sudo ./main # sudo required so the backend can bind to 443
```