
export const userDTO = (user) => {
    return {
      id: user._id,
      name: `${user.first_name} ${user.last_name}`,
      email: user.email,
      age: user.age,
    };
  };
  