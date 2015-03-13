local res_set = redis.call('set', KEYS[1], 1, 'NX')

local res_expire = redis.call('expire', KEYS[1], ARGV[1])

local res_get = redis.call('get', KEYS[2])

return {res_set, res_expire, res_get}