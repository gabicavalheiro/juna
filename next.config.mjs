export async function rewrites() {
    return [
        {
            source: '/dashboard-administrador/:userId/:token',
            destination: '/dashboard-administrador/[userId]/[token]',
        },
        {
            source: '/Agenda/:userId/:token',
            destination: '/Agenda/[userId]/[token]',
        },
        {
            source: '/metas/:userId/:token',
            destination: '/metas/[userId]/[token]',
        },
        {
            source: '/Publicacoes/:userId/:token',
            destination: '/Publicacoes/[userId]/[token]',
        },
        {
            source: '/Influenciadores/:userId/:token',
            destination: '/Influenciadores/[userId]/[token]',
        },
        {
            source: '/Cadastro/:userId/:token',
            destination: '/Cadastro/[userId]/[token]',
        },
    ];
}
