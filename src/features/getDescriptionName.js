export const getDescriptionName = ({members, user}) => {
    let name;
    if (members && user) {
        if (members?.length === 2) {
            name = members.find(member => member.UserId !== user.Id).User.displayName;
        } else {
            const limit = 2;
            const names = members
                .filter(member => member.UserId !== user.Id)
                .map(member => member.User.displayName);
            name = names.slice(0, Math.min(limit, names.length)).join(", ");
            if (members.length > limit + 1) {
                name += `... +${members.length - limit + 1} others`
            }
        }
    }
    return name;
}