local res_set = redis.call('set', KEYS[1], ARGV[1])

local res_expire = redis.call('expire', KEYS[1], ARGV[2])

local res_del = redis.call('del', KEYS[2])

return {res_set, res_expire, res_del}