import httpx


URL = "http://localhost:3000/api/v1/users/clea42ofr0000vkdk27zyc99u/records"


def main():
    res = httpx.post(URL, json={
        "date": "2019-02-28",
        "time-spent": "P",
        "programming-language": "Python",
        "rating": 5,
        "description": "Very cool, ngl"
    })
    print(res.status_code)
    print(res.is_error)
    if not res.is_error:
        print(res.json())


if __name__ == "__main__":
    main()
